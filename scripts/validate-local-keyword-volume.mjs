import fs from "node:fs/promises";
import path from "node:path";

const username = process.env.DATAFORSEO_USERNAME;
const password = process.env.DATAFORSEO_PASSWORD;
const baseUrl = process.env.DATAFORSEO_BASE_URL || "https://api.dataforseo.com/v3";
if (!username || !password) throw new Error("DataForSEO credentials are required.");

const keywords = [
  "same day water heater replacement sacramento",
  "gas water heater replacement sacramento",
  "electric water heater replacement sacramento",
  "heat pump water heater replacement sacramento",
  "water heater installation sacramento",
  "water heater replacement roseville",
  "water heater replacement rocklin",
  "water heater replacement lincoln ca",
  "water heater replacement auburn ca",
  "water heater replacement granite bay",
  "water heater replacement loomis ca",
];

const response = await fetch(`${baseUrl}/keywords_data/google_ads/search_volume/live`, {
  method: "POST",
  headers: {
    Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify([{
    keywords,
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

const rows = (task.result || []).map((item) => ({
  keyword: item.keyword,
  search_volume: item.search_volume ?? 0,
  cpc: item.cpc ?? 0,
  competition: item.competition ?? null,
  competition_index: item.competition_index ?? null,
  monthly_searches: item.monthly_searches ?? [],
})).sort((a, b) => b.search_volume - a.search_volume || b.cpc - a.cpc || a.keyword.localeCompare(b.keyword));

const requestedAt = new Date().toISOString();
const report = {
  requested_at: requestedAt,
  provider: "DataForSEO Google Ads Search Volume Live",
  location: "United States",
  requested_keywords: keywords,
  cost: Number(task.cost || payload.cost || 0),
  rows,
};
const outDir = path.resolve("research", "dataforseo", requestedAt.slice(0, 10));
await fs.mkdir(outDir, { recursive: true });
const output = path.join(outDir, "validated-local-keyword-volume.json");
await fs.writeFile(output, `${JSON.stringify(report, null, 2)}\n`);
process.stdout.write(JSON.stringify({ output, requested: keywords.length, returned: rows.length, cost: report.cost }, null, 2));
