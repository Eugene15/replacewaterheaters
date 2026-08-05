import fs from "node:fs/promises";
import path from "node:path";

const username = process.env.DATAFORSEO_USERNAME;
const password = process.env.DATAFORSEO_PASSWORD;
const baseUrl = process.env.DATAFORSEO_BASE_URL || "https://api.dataforseo.com/v3";
if (!username || !password) throw new Error("DataForSEO credentials are required.");

const groups = [
  {
    id: "water_heater",
    seeds: ["water heater replacement", "water heater installation", "tankless water heater installation"],
  },
  {
    id: "painting_interior",
    seeds: ["interior house painting", "interior painters", "interior painting services"],
  },
  {
    id: "painting_exterior",
    seeds: ["exterior house painting", "exterior painters", "exterior painting services"],
  },
  {
    id: "wallpaper",
    seeds: ["wallpaper installer", "wallpaper installation", "wallpaper hanging"],
  },
  {
    id: "floristry",
    seeds: ["florist", "flower delivery", "same day flower delivery", "wedding flowers"],
  },
];

const reports = [];
for (const group of groups) {
  const response = await fetch(`${baseUrl}/dataforseo_labs/google/keyword_ideas/live`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([{
      keywords: group.seeds,
      location_name: "United States",
      language_code: "en",
      include_serp_info: true,
      limit: 1000,
    }]),
  });
  const payload = await response.json();
  const task = payload.tasks?.[0];
  if (!response.ok || payload.status_code !== 20000 || task?.status_code !== 20000) {
    throw new Error(`DataForSEO request failed for ${group.id}: HTTP ${response.status}; API ${payload.status_code}; task ${task?.status_code ?? "n/a"} ${task?.status_message ?? "n/a"}`);
  }

  const items = task?.result?.[0]?.items || [];
  const rows = items.map((item) => {
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

  reports.push({
    ...group,
    cost: Number(task.cost || 0),
    returned_keywords: rows.length,
    rows,
  });
}

const requestedAt = new Date().toISOString();
const report = {
  requested_at: requestedAt,
  provider: "DataForSEO Labs Google Keyword Ideas Live",
  location: "United States",
  total_cost: reports.reduce((sum, group) => sum + group.cost, 0),
  groups: reports,
};
const outDir = path.resolve("research", "dataforseo", requestedAt.slice(0, 10));
await fs.mkdir(outDir, { recursive: true });
const output = path.join(outDir, "all-services-keyword-ideas.json");
await fs.writeFile(output, `${JSON.stringify(report, null, 2)}\n`);

process.stdout.write(JSON.stringify({
  output,
  total_cost: report.total_cost,
  groups: reports.map(({ id, seeds, cost, returned_keywords }) => ({ id, seeds, cost, returned_keywords })),
}, null, 2));
