import fs from "node:fs/promises";
import path from "node:path";

const username = process.env.DATAFORSEO_USERNAME;
const password = process.env.DATAFORSEO_PASSWORD;
const baseUrl = process.env.DATAFORSEO_BASE_URL || "https://api.dataforseo.com/v3";
if (!username || !password) throw new Error("DataForSEO credentials are required.");

const markets = [
  "Sacramento", "San Diego", "San Jose", "Huntington Beach", "Orange County", "Livermore",
  "San Francisco", "Fremont", "Los Angeles", "Folsom", "Roseville", "San Mateo", "Sunnyvale",
  "Santa Monica", "Chula Vista", "Carlsbad", "Thousand Oaks",
];
const clusters = [
  { id: "replacement", stem: "water heater replacement" },
  { id: "installation", stem: "water heater installation" },
  { id: "cost", stem: "water heater replacement cost" },
  { id: "tankless", stem: "tankless water heater" },
  { id: "same_day", stem: "same day water heater replacement" },
  { id: "gas", stem: "gas water heater replacement" },
  { id: "electric", stem: "electric water heater replacement" },
  { id: "heat_pump", stem: "heat pump water heater replacement" },
];

const meta = markets.flatMap((market) => clusters.flatMap((cluster) => [
  { market, ...cluster, variant: "city", keyword: `${cluster.stem} ${market}`.toLowerCase() },
  { market, ...cluster, variant: "city_ca", keyword: `${cluster.stem} ${market} ca`.toLowerCase() },
]));

const response = await fetch(`${baseUrl}/keywords_data/google_ads/search_volume/live`, {
  method: "POST",
  headers: {
    Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify([{
    keywords: meta.map(({ keyword }) => keyword),
    location_name: "United States",
    language_code: "en",
    include_adult_keywords: false,
  }]),
});

const payload = await response.json();
const task = payload.tasks?.[0];
if (!response.ok || payload.status_code !== 20000 || task?.status_code !== 20000) {
  throw new Error(`DataForSEO request failed: HTTP ${response.status}; API ${payload.status_code}; task ${task?.status_code} ${task?.status_message}`);
}
const resultMap = new Map((task.result || []).map((item) => [String(item.keyword).toLowerCase(), item]));
const rows = meta.map((entry) => {
  const item = resultMap.get(entry.keyword) || {};
  return { ...entry, search_volume: item.search_volume ?? 0, cpc: item.cpc ?? 0, competition: item.competition ?? null, monthly_searches: item.monthly_searches ?? [] };
});

const summary = markets.map((market) => {
  const values = Object.fromEntries(clusters.map((cluster) => {
    const candidates = rows.filter((row) => row.market === market && row.id === cluster.id);
    const best = [...candidates].sort((a, b) => b.search_volume - a.search_volume || b.cpc - a.cpc)[0];
    return [cluster.id, { keyword: best.keyword, volume: best.search_volume, cpc: best.cpc }];
  }));
  return {
    market,
    ...Object.fromEntries(Object.entries(values).map(([id, value]) => [id, value.volume])),
    total_distinct_cluster_volume: Object.values(values).reduce((sum, value) => sum + value.volume, 0),
    selected_keywords: values,
  };
}).sort((a, b) => b.total_distinct_cluster_volume - a.total_distinct_cluster_volume || a.market.localeCompare(b.market));

const requestedAt = new Date().toISOString();
const report = {
  requested_at: requestedAt,
  provider: "DataForSEO Google Ads Search Volume Live",
  location: "United States",
  cost: Number(task.cost || payload.cost || 0),
  methodology: "For each market and distinct commercial cluster, select the higher-volume city or city-CA form; do not sum close variants within a cluster.",
  requested_keywords: meta.length,
  summary,
  rows,
};
const outDir = path.resolve("research", "dataforseo", requestedAt.slice(0, 10));
await fs.mkdir(outDir, { recursive: true });
const output = path.join(outDir, "market-cluster-demand.json");
await fs.writeFile(output, `${JSON.stringify(report, null, 2)}\n`);
process.stdout.write(JSON.stringify({ output, requested: meta.length, markets: markets.length, cost: report.cost }, null, 2));
