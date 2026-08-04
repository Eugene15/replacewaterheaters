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

const stems = [
  { service: "interior_painting", cluster: "main", stem: "interior painters" },
  { service: "interior_painting", cluster: "main", stem: "interior painting contractors" },
  { service: "interior_painting", cluster: "main", stem: "interior painting services" },
  { service: "interior_painting", cluster: "house", stem: "interior house painting" },
  { service: "interior_painting", cluster: "residential", stem: "residential interior painting" },
  { service: "interior_painting", cluster: "walls", stem: "interior wall painting" },
  { service: "interior_painting", cluster: "cost", stem: "interior painting cost" },
  { service: "exterior_painting", cluster: "main", stem: "exterior painters" },
  { service: "exterior_painting", cluster: "main", stem: "exterior painting contractors" },
  { service: "exterior_painting", cluster: "main", stem: "exterior painting services" },
  { service: "exterior_painting", cluster: "house", stem: "exterior house painting" },
  { service: "exterior_painting", cluster: "residential", stem: "residential exterior painting" },
  { service: "exterior_painting", cluster: "home", stem: "exterior home painting" },
  { service: "exterior_painting", cluster: "cost", stem: "exterior painting cost" },
  { service: "wallpaper_installation", cluster: "main", stem: "wallpaper installer" },
  { service: "wallpaper_installation", cluster: "main", stem: "wallpaper installation" },
  { service: "wallpaper_installation", cluster: "hanging", stem: "wallpaper hanging" },
  { service: "wallpaper_installation", cluster: "hanging", stem: "wallpaper hanger" },
  { service: "wallpaper_installation", cluster: "professional", stem: "professional wallpaper installer" },
  { service: "wallpaper_installation", cluster: "peel_and_stick", stem: "peel and stick wallpaper installer" },
];

const meta = markets.flatMap((market) => stems.flatMap((entry) => [
  { market, ...entry, variant: "city", keyword: `${entry.stem} ${market}`.toLowerCase() },
  { market, ...entry, variant: "city_ca", keyword: `${entry.stem} ${market} ca`.toLowerCase() },
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
  throw new Error(`DataForSEO request failed: HTTP ${response.status}; API ${payload.status_code}; task ${task?.status_code ?? "n/a"} ${task?.status_message ?? "n/a"}`);
}

const resultMap = new Map((task.result || []).map((item) => [String(item.keyword).toLowerCase(), item]));
const rows = meta.map((entry) => {
  const item = resultMap.get(entry.keyword) || {};
  return {
    ...entry,
    search_volume: item.search_volume ?? 0,
    cpc: item.cpc ?? 0,
    competition: item.competition ?? null,
    monthly_searches: item.monthly_searches ?? [],
  };
});

const summary = markets.map((market) => {
  const marketRows = rows.filter((row) => row.market === market);
  const services = Object.fromEntries([...new Set(stems.map(({ service }) => service))].map((service) => {
    const clusterNames = [...new Set(stems.filter((entry) => entry.service === service).map(({ cluster }) => cluster))];
    const clusters = Object.fromEntries(clusterNames.map((cluster) => {
      const candidates = marketRows.filter((row) => row.service === service && row.cluster === cluster);
      const best = [...candidates].sort((a, b) => b.search_volume - a.search_volume || b.cpc - a.cpc)[0];
      return [cluster, {
        keyword: best.keyword,
        volume: best.search_volume,
        cpc: best.cpc,
        competition: best.competition,
      }];
    }));
    return [service, {
      total_distinct_cluster_volume: Object.values(clusters).reduce((sum, item) => sum + item.volume, 0),
      clusters,
    }];
  }));
  return {
    market,
    services,
    total_distinct_cluster_volume: Object.values(services).reduce((sum, service) => sum + service.total_distinct_cluster_volume, 0),
  };
}).sort((a, b) => b.total_distinct_cluster_volume - a.total_distinct_cluster_volume || a.market.localeCompare(b.market));

const requestedAt = new Date().toISOString();
const report = {
  requested_at: requestedAt,
  provider: "DataForSEO Google Ads Search Volume Live",
  location: "United States",
  methodology: "For each city and intent cluster, select the highest-volume stem and city/city-CA form; do not sum close synonyms within a cluster.",
  requested_keywords: meta.length,
  cost: Number(task.cost || payload.cost || 0),
  markets,
  stems,
  summary,
  rows,
};

const outDir = path.resolve("research", "dataforseo", requestedAt.slice(0, 10));
await fs.mkdir(outDir, { recursive: true });
const output = path.join(outDir, "painting-wallpaper-city-demand.json");
await fs.writeFile(output, `${JSON.stringify(report, null, 2)}\n`);
process.stdout.write(JSON.stringify({ output, requested: meta.length, markets: markets.length, cost: report.cost }, null, 2));
