import fs from "node:fs/promises";
import path from "node:path";

const username = process.env.DATAFORSEO_USERNAME;
const password = process.env.DATAFORSEO_PASSWORD;
const baseUrl = process.env.DATAFORSEO_BASE_URL || "https://api.dataforseo.com/v3";
if (!username || !password) throw new Error("DataForSEO credentials are required.");

const seed = "water heater replacement Sacramento";
const location = "United States";
const response = await fetch(`${baseUrl}/dataforseo_labs/google/keyword_suggestions/live`, {
  method: "POST",
  headers: {
    Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify([{
    keyword: seed,
    location_name: location,
    language_code: "en",
    include_seed_keyword: true,
    include_serp_info: true,
    limit: 1000,
  }]),
});

const payload = await response.json();
const failedTask = payload.tasks?.find((task) => task.status_code !== 20000);
if (!response.ok || payload.status_code !== 20000 || failedTask) {
  throw new Error(
    `DataForSEO request failed: HTTP ${response.status}; API ${payload.status_code} ${payload.status_message}; task ${failedTask?.status_code ?? "n/a"} ${failedTask?.status_message ?? "n/a"}`,
  );
}

const items = payload.tasks?.[0]?.result?.[0]?.items || [];
const rows = items.map((item) => {
  const data = item.keyword_data || item;
  const info = data.keyword_info || {};
  return {
    keyword: data.keyword || item.keyword,
    search_volume: info.search_volume ?? 0,
    cpc: info.cpc ?? 0,
    competition: info.competition ?? null,
    competition_level: info.competition_level ?? null,
    intent: data.search_intent_info?.main_intent ?? null,
    monthly_searches: info.monthly_searches ?? [],
    serp_info: data.serp_info ?? null,
  };
}).filter((row) => row.keyword)
  .sort((a, b) => b.search_volume - a.search_volume || b.cpc - a.cpc || a.keyword.localeCompare(b.keyword));

const requestedAt = new Date().toISOString();
const report = {
  requested_at: requestedAt,
  provider: "DataForSEO Labs Google Keyword Suggestions Live",
  seed,
  location,
  cost: Number(payload.cost || payload.tasks?.[0]?.cost || 0),
  returned_keywords: rows.length,
  rows,
};
const outDir = path.resolve("research", "dataforseo", requestedAt.slice(0, 10));
await fs.mkdir(outDir, { recursive: true });
const output = path.join(outDir, "sacramento-keyword-discovery.json");
await fs.writeFile(output, `${JSON.stringify(report, null, 2)}\n`);
process.stdout.write(JSON.stringify({ output, seed, location, cost: report.cost, returned_keywords: rows.length }, null, 2));
