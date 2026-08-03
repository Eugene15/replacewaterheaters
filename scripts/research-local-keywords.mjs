import fs from "node:fs/promises";
import path from "node:path";

const username = process.env.DATAFORSEO_USERNAME;
const password = process.env.DATAFORSEO_PASSWORD;
if (!username || !password) throw new Error("DataForSEO credentials are required.");

const cities = [
  { city: "Sacramento", county: "Sacramento" },
  { city: "Roseville", county: "Placer" },
  { city: "Rocklin", county: "Placer" },
  { city: "Lincoln", county: "Placer" },
  { city: "Auburn", county: "Placer" },
  { city: "Granite Bay", county: "Placer" },
  { city: "Loomis", county: "Placer" },
  { city: "Colfax", county: "Placer" },
  { city: "Citrus Heights", county: "Sacramento" },
  { city: "Folsom", county: "Sacramento" },
  { city: "Elk Grove", county: "Sacramento" },
  { city: "Rancho Cordova", county: "Sacramento" },
  { city: "Carmichael", county: "Sacramento" },
  { city: "Fair Oaks", county: "Sacramento" },
  { city: "Orangevale", county: "Sacramento" },
];

const stems = [
  "water heater replacement",
  "hot water heater replacement",
  "water heater installation",
  "hot water heater installation",
  "same day water heater replacement",
  "emergency water heater replacement",
  "gas water heater replacement",
  "electric water heater replacement",
  "tankless water heater replacement",
  "tankless water heater installation",
  "heat pump water heater installation",
  "water heater installer",
  "replace water heater",
  "water heater replacement cost",
  "new water heater",
];

const keywordMeta = cities.flatMap(({ city, county }) =>
  stems.map((stem) => ({ keyword: `${stem} ${city}`, city, county, stem })),
);

async function post(endpoint, body) {
  const response = await fetch(`https://api.dataforseo.com/v3${endpoint}`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const payload = await response.json();
  const failedTask = payload.tasks?.find((task) => task.status_code !== 20000);
  if (!response.ok || payload.status_code !== 20000 || failedTask) {
    throw new Error(
      `DataForSEO request failed: HTTP ${response.status}; API ${payload.status_code} ${payload.status_message}; task ${failedTask?.status_code ?? "n/a"} ${failedTask?.status_message ?? "n/a"}`,
    );
  }
  return payload;
}

const volumePayload = await post("/keywords_data/google/search_volume/live", [{
  keywords: keywordMeta.map(({ keyword }) => keyword),
  location_name: "California,United States",
  language_code: "en",
  include_adult_keywords: false,
}]);

const rawRows = volumePayload.tasks?.[0]?.result || [];
const byKeyword = new Map(rawRows.map((item) => [item.keyword.toLowerCase(), item]));
const rows = keywordMeta.map((meta) => {
  const item = byKeyword.get(meta.keyword.toLowerCase()) || {};
  return {
    ...meta,
    search_volume: item.search_volume ?? 0,
    cpc: item.cpc ?? 0,
    competition: item.competition ?? null,
    competition_index: item.competition_index ?? null,
    monthly_searches: item.monthly_searches ?? [],
  };
}).sort((a, b) => b.search_volume - a.search_volume || b.cpc - a.cpc || a.keyword.localeCompare(b.keyword));

const citySummary = cities.map(({ city, county }) => {
  const cityRows = rows.filter((row) => row.city === city);
  return {
    city,
    county,
    total_exact_volume: cityRows.reduce((sum, row) => sum + row.search_volume, 0),
    keywords_with_volume: cityRows.filter((row) => row.search_volume > 0).length,
    max_cpc: Math.max(0, ...cityRows.map((row) => row.cpc || 0)),
    top_keywords: cityRows.filter((row) => row.search_volume > 0).slice(0, 8),
  };
}).sort((a, b) => b.total_exact_volume - a.total_exact_volume || b.max_cpc - a.max_cpc);

const output = {
  requested_at: new Date().toISOString(),
  location: "California, United States",
  methodology: "Exact city-modified keyword set via DataForSEO Google Ads search volume live endpoint.",
  cost: volumePayload.cost || 0,
  cities: citySummary,
  rows,
};

const outDir = path.resolve("research", "dataforseo", new Date().toISOString().slice(0, 10));
await fs.mkdir(outDir, { recursive: true });
await fs.writeFile(path.join(outDir, "local-keyword-volume.json"), JSON.stringify(output, null, 2));
process.stdout.write(JSON.stringify({ outDir, cost: output.cost, citySummary }, null, 2));
