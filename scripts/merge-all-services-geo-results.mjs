import fs from "node:fs/promises";
import path from "node:path";

const dateDir = path.resolve("research", "dataforseo", "2026-08-05");
const csvLines = (await fs.readFile(path.resolve("DATAFORSEO_LIVE_KEYWORDS_REVIEW.csv"), "utf8")).trim().split(/\r?\n/);
const keywords = csvLines.slice(1).map((line) => {
  const [category, cluster, ...parts] = line.split(",");
  return { category, cluster, keyword: parts.join(",").trim() };
});

const standard = JSON.parse(await fs.readFile(path.join(dateDir, "standard-geo-volume-collected.json"), "utf8"));
const live = JSON.parse(await fs.readFile(path.join(dateDir, "all-services-geo-volume-from-13.json"), "utf8"));

const normalizedMarkets = [];
for (const market of standard.markets) {
  if (!market.ready) throw new Error(`Standard result is not ready: ${market.market}`);
  const resultMap = new Map((market.result || []).map((item) => [String(item.keyword).toLowerCase(), item]));
  normalizedMarkets.push({
    market: market.market,
    location_name: market.location_name,
    source: "Standard Queue",
    rows: keywords.map((entry) => {
      const item = resultMap.get(entry.keyword.toLowerCase()) || {};
      return {
        ...entry,
        search_volume: item.search_volume ?? 0,
        cpc: item.cpc ?? 0,
        competition: item.competition ?? null,
        competition_index: item.competition_index ?? null,
        low_top_of_page_bid: item.low_top_of_page_bid ?? null,
        high_top_of_page_bid: item.high_top_of_page_bid ?? null,
        monthly_searches: item.monthly_searches ?? [],
      };
    }),
  });
}
for (const market of live.markets) {
  normalizedMarkets.push({
    market: market.market,
    location_name: market.location_name,
    source: "Live",
    rows: market.rows,
  });
}

const expected = ["Sacramento", "San Diego", "San Jose", "Huntington Beach", "Orange County", "Livermore", "San Francisco", "Fremont", "Los Angeles", "Folsom", "Roseville", "San Mateo", "Sunnyvale", "Santa Monica", "Chula Vista", "Carlsbad", "Thousand Oaks"];
const byMarket = new Map(normalizedMarkets.map((market) => [market.market, market]));
for (const market of expected) if (!byMarket.has(market)) throw new Error(`Missing market: ${market}`);
const markets = expected.map((market) => byMarket.get(market));

const categories = [...new Set(keywords.map((row) => row.category))];
const summary = markets.map((market) => {
  const categorySummary = {};
  for (const category of categories) {
    const categoryRows = market.rows.filter((row) => row.category === category);
    const clusters = [...new Set(categoryRows.map((row) => row.cluster))].map((cluster) => {
      const rows = categoryRows.filter((row) => row.cluster === cluster);
      const best = [...rows].sort((a, b) => b.search_volume - a.search_volume || b.cpc - a.cpc)[0];
      return { cluster, keyword: best.keyword, volume: best.search_volume, cpc: best.cpc };
    });
    categorySummary[category] = {
      cluster_deduplicated_volume: clusters.reduce((sum, cluster) => sum + cluster.volume, 0),
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

const combined = {
  generated_at: new Date().toISOString(),
  provider: "DataForSEO Google Ads Search Volume",
  methodology: "The same 403 city-free keywords were measured separately in 17 California locations. Summary totals select only the highest-volume keyword inside each manually defined intent cluster; raw synonyms must not be summed.",
  keyword_count: keywords.length,
  market_count: markets.length,
  markets,
  summary,
};
await fs.writeFile(path.join(dateDir, "all-services-17-market-geo-volume-complete.json"), `${JSON.stringify(combined, null, 2)}\n`);

const escapeCsv = (value) => {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
};
const detail = ["market,category,cluster,keyword,search_volume,cpc,competition,competition_index,low_top_of_page_bid,high_top_of_page_bid"];
for (const market of markets) {
  for (const row of market.rows) {
    detail.push([market.market, row.category, row.cluster, row.keyword, row.search_volume, row.cpc, row.competition, row.competition_index, row.low_top_of_page_bid, row.high_top_of_page_bid].map(escapeCsv).join(","));
  }
}
await fs.writeFile(path.join(dateDir, "all-services-17-market-keyword-volume.csv"), `${detail.join("\n")}\n`);

const matrix = [["category", "cluster", "keyword", ...expected].join(",")];
for (const keyword of keywords) {
  matrix.push([keyword.category, keyword.cluster, keyword.keyword, ...expected.map((market) => byMarket.get(market).rows.find((row) => row.keyword === keyword.keyword)?.search_volume ?? 0)].map(escapeCsv).join(","));
}
await fs.writeFile(path.join(dateDir, "all-services-17-market-volume-matrix.csv"), `${matrix.join("\n")}\n`);

const summaryCsv = ["rank,market,cluster_deduplicated_total," + categories.join(",")];
summary.forEach((item, index) => summaryCsv.push([index + 1, item.market, item.cluster_deduplicated_total, ...categories.map((category) => item.categories[category].cluster_deduplicated_volume)].join(",")));
await fs.writeFile(path.join(dateDir, "all-services-17-market-summary.csv"), `${summaryCsv.join("\n")}\n`);

console.log(JSON.stringify({ keyword_count: keywords.length, market_count: markets.length, summary }, null, 2));
