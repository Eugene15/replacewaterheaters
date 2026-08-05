import fs from "node:fs/promises";
import path from "node:path";

const dateDir = path.resolve("research", "dataforseo", "2026-08-05");
const sourceCsv = path.resolve("DATAFORSEO_LIVE_KEYWORDS_REVIEW.csv");
const sourceReport = path.join(dateDir, "all-services-17-market-geo-volume-complete.json");
const strictCsv = path.resolve("DATAFORSEO_LIVE_KEYWORDS_STRICT.csv");

const lines = (await fs.readFile(sourceCsv, "utf8")).trim().split(/\r?\n/);
const rows = lines.slice(1).map((line) => {
  const [category, cluster, ...parts] = line.split(",");
  return { category, cluster, keyword: parts.join(",").trim() };
});

const explicitReplacementService = /\b(replace|replacement|install|installation|installer|installers|conversion|convert|change out|changeout|swap)\b/i;
const excludedIntent = /\b(repair|maintenance|service only|parts?|thermostat|igniter|anode|flush|flushing|gallon|brand|lifespan|warranty)\b/i;
const keep = (row) => row.category !== "water_heater" || (explicitReplacementService.test(row.keyword) && !excludedIntent.test(row.keyword));
const strictRows = rows.filter(keep);
const excludedWaterHeater = rows.filter((row) => row.category === "water_heater" && !keep(row));

await fs.writeFile(strictCsv, `${["category,cluster,keyword", ...strictRows.map((row) => `${row.category},${row.cluster},${row.keyword}`)].join("\n")}\n`);
await fs.writeFile(path.join(dateDir, "water-heater-excluded-nonreplacement-keywords.csv"), `${["category,cluster,keyword,reason", ...excludedWaterHeater.map((row) => `${row.category},${row.cluster},${row.keyword},no explicit replacement or installation intent`)].join("\n")}\n`);

const report = JSON.parse(await fs.readFile(sourceReport, "utf8"));
const strictKeywords = new Set(strictRows.map((row) => row.keyword));
const markets = report.markets.map((market) => ({
  ...market,
  rows: market.rows.filter((row) => strictKeywords.has(row.keyword)),
}));

const categories = [...new Set(strictRows.map((row) => row.category))];
const summary = markets.map((market) => {
  const categorySummary = {};
  for (const category of categories) {
    const categoryRows = market.rows.filter((row) => row.category === category);
    const clusters = [...new Set(categoryRows.map((row) => row.cluster))].map((cluster) => {
      const candidates = categoryRows.filter((row) => row.cluster === cluster);
      const best = [...candidates].sort((a, b) => b.search_volume - a.search_volume || b.cpc - a.cpc)[0];
      return { cluster, keyword: best.keyword, volume: best.search_volume, cpc: best.cpc };
    });
    categorySummary[category] = {
      cluster_deduplicated_volume: clusters.reduce((sum, item) => sum + item.volume, 0),
      keywords_with_volume: categoryRows.filter((row) => row.search_volume > 0).length,
      clusters,
    };
  }
  return {
    market: market.market,
    categories: categorySummary,
    cluster_deduplicated_total: Object.values(categorySummary).reduce((sum, category) => sum + category.cluster_deduplicated_volume, 0),
  };
}).sort((a, b) => b.cluster_deduplicated_total - a.cluster_deduplicated_total);

const strictReport = {
  generated_at: new Date().toISOString(),
  source: sourceReport,
  scope: "Water-heater keywords require explicit replacement, installation, installer, changeout, swap, or conversion intent. Product sales, repair, maintenance, parts, and generic equipment-price terms are excluded.",
  keyword_count: strictRows.length,
  water_heater_keyword_count: strictRows.filter((row) => row.category === "water_heater").length,
  excluded_water_heater_keyword_count: excludedWaterHeater.length,
  market_count: markets.length,
  markets,
  summary,
};
await fs.writeFile(path.join(dateDir, "all-services-17-market-geo-volume-strict.json"), `${JSON.stringify(strictReport, null, 2)}\n`);

const escapeCsv = (value) => {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
};
const expected = report.markets.map((market) => market.market);
const matrix = [["category", "cluster", "keyword", ...expected].join(",")];
for (const keyword of strictRows) {
  matrix.push([keyword.category, keyword.cluster, keyword.keyword, ...markets.map((market) => market.rows.find((row) => row.keyword === keyword.keyword)?.search_volume ?? 0)].map(escapeCsv).join(","));
}
await fs.writeFile(path.join(dateDir, "all-services-17-market-volume-matrix-strict.csv"), `${matrix.join("\n")}\n`);

const summaryCsv = ["rank,market,cluster_deduplicated_total," + categories.join(",")];
summary.forEach((item, index) => summaryCsv.push([index + 1, item.market, item.cluster_deduplicated_total, ...categories.map((category) => item.categories[category].cluster_deduplicated_volume)].join(",")));
await fs.writeFile(path.join(dateDir, "all-services-17-market-summary-strict.csv"), `${summaryCsv.join("\n")}\n`);

console.log(JSON.stringify({ strict_keyword_count: strictRows.length, strict_water_heater_count: strictRows.filter((row) => row.category === "water_heater").length, excluded_water_heater_count: excludedWaterHeater.length, excluded: excludedWaterHeater.map((row) => row.keyword) }, null, 2));
