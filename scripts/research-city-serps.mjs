import fs from "node:fs/promises";
import path from "node:path";

const username = process.env.DATAFORSEO_USERNAME;
const password = process.env.DATAFORSEO_PASSWORD;
const baseUrl = process.env.DATAFORSEO_BASE_URL || "https://api.dataforseo.com/v3";
if (!username || !password) throw new Error("DataForSEO credentials are required.");

const keyword = "water heater replacement";
const cities = ["Sacramento", "Roseville", "Rocklin", "Lincoln", "Auburn", "Granite Bay", "Loomis"];
const auth = `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;
const rows = [];
let cost = 0;

for (const city of cities) {
  const location = `${city},California,United States`;
  const response = await fetch(`${baseUrl}/serp/google/organic/live/advanced`, {
    method: "POST",
    headers: { Authorization: auth, "Content-Type": "application/json" },
    body: JSON.stringify([{
      keyword,
      location_name: location,
      language_code: "en",
      device: "desktop",
      os: "windows",
      depth: 20,
    }]),
  });
  const payload = await response.json();
  const task = payload.tasks?.[0];
  if (!response.ok || payload.status_code !== 20000 || task?.status_code !== 20000) {
    throw new Error(`DataForSEO ${city}: HTTP ${response.status}; API ${payload.status_code}; task ${task?.status_code} ${task?.status_message}`);
  }
  cost += Number(task.cost || 0);
  const result = task.result?.[0] || {};
  const items = result.items || [];
  rows.push({
    city,
    location,
    check_url: result.check_url || null,
    item_types: result.item_types || [...new Set(items.map((item) => item.type))],
    local_pack: items.filter((item) => ["local_pack", "maps_search"].includes(item.type)),
    people_also_ask: items.filter((item) => item.type === "people_also_ask"),
    organic: items.filter((item) => item.type === "organic").slice(0, 20).map((item) => ({
      rank_group: item.rank_group,
      rank_absolute: item.rank_absolute,
      domain: item.domain,
      url: item.url,
      title: item.title,
      description: item.description || null,
      breadcrumb: item.breadcrumb || null,
    })),
  });
}

const requestedAt = new Date().toISOString();
const report = {
  requested_at: requestedAt,
  provider: "DataForSEO Google Organic Live Advanced",
  keyword,
  device: "desktop",
  depth: 20,
  cost: Number(cost.toFixed(6)),
  rows,
};
const outDir = path.resolve("research", "dataforseo", requestedAt.slice(0, 10));
await fs.mkdir(outDir, { recursive: true });
const output = path.join(outDir, "city-serps-water-heater-replacement.json");
await fs.writeFile(output, `${JSON.stringify(report, null, 2)}\n`);
process.stdout.write(JSON.stringify({ output, query_count: cities.length, cost: report.cost }, null, 2));
