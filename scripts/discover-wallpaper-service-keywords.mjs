import fs from "node:fs/promises";
import path from "node:path";

const username = process.env.DATAFORSEO_USERNAME;
const password = process.env.DATAFORSEO_PASSWORD;
const baseUrl = process.env.DATAFORSEO_BASE_URL || "https://api.dataforseo.com/v3";
if (!username || !password) throw new Error("DataForSEO credentials are required.");

const seed = "wallpaper installer";
const response = await fetch(`${baseUrl}/dataforseo_labs/google/keyword_suggestions/live`, {
  method: "POST",
  headers: {
    Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify([{
    keyword: seed,
    location_name: "United States",
    language_code: "en",
    include_seed_keyword: true,
    include_serp_info: true,
    limit: 1000,
  }]),
});

const payload = await response.json();
const task = payload.tasks?.[0];
if (!response.ok || payload.status_code !== 20000 || task?.status_code !== 20000) {
  throw new Error(`DataForSEO request failed: HTTP ${response.status}; API ${payload.status_code}; task ${task?.status_code ?? "n/a"} ${task?.status_message ?? "n/a"}`);
}

const rows = (task.result?.[0]?.items || []).map((item) => {
  const data = item.keyword_data || item;
  const info = data.keyword_info || {};
  return {
    keyword: String(data.keyword || item.keyword || "").trim().toLowerCase(),
    search_volume: info.search_volume ?? 0,
    cpc: info.cpc ?? 0,
    competition: info.competition ?? null,
    competition_level: info.competition_level ?? null,
    intent: data.search_intent_info?.main_intent ?? null,
    monthly_searches: info.monthly_searches ?? [],
  };
}).filter((row) => row.keyword)
  .sort((a, b) => b.search_volume - a.search_volume || b.cpc - a.cpc || a.keyword.localeCompare(b.keyword));

const requestedAt = new Date().toISOString();
const report = {
  requested_at: requestedAt,
  provider: "DataForSEO Labs Google Keyword Suggestions Live",
  seed,
  location: "United States",
  cost: Number(task.cost || payload.cost || 0),
  returned_keywords: rows.length,
  rows,
};
const outDir = path.resolve("research", "dataforseo", requestedAt.slice(0, 10));
await fs.mkdir(outDir, { recursive: true });
const output = path.join(outDir, "wallpaper-service-keyword-suggestions.json");
await fs.writeFile(output, `${JSON.stringify(report, null, 2)}\n`);
process.stdout.write(JSON.stringify({ output, seed, cost: report.cost, returned_keywords: rows.length }, null, 2));
