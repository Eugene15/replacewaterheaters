import fs from "node:fs/promises";
import path from "node:path";

const username = process.env.DATAFORSEO_USERNAME;
const password = process.env.DATAFORSEO_PASSWORD;
const baseUrl = process.env.DATAFORSEO_BASE_URL || "https://api.dataforseo.com/v3";
if (!username || !password) throw new Error("DataForSEO credentials are required.");

const locationName = "San Diego,California,United States";
const queries = [
  { category: "floristry", keyword: "flowers" },
  { category: "water_heater", keyword: "water heater" },
  { category: "water_heater", keyword: "water heaters" },
  { category: "water_heater", keyword: "hot water heater" },
  { category: "water_heater", keyword: "tankless water heater" },
  { category: "water_heater", keyword: "gas water heater" },
  { category: "water_heater", keyword: "electric water heater" },
  { category: "water_heater", keyword: "heat pump water heater" },
];

const requestedAt = new Date().toISOString();
const outDir = path.resolve("research", "dataforseo", requestedAt.slice(0, 10));
await fs.mkdir(outDir, { recursive: true });
const output = path.join(outDir, "san-diego-broad-intent-serps.json");
let report = { requested_at: requestedAt, provider: "DataForSEO Google Organic Live Advanced", location_name: locationName, device: "mobile", depth: 20, cost: 0, results: [] };
try { report = JSON.parse(await fs.readFile(output, "utf8")); } catch {}
const completed = new Set(report.results.map((item) => item.keyword));
const auth = `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;

for (const query of queries) {
  if (completed.has(query.keyword)) continue;
  const response = await fetch(`${baseUrl}/serp/google/organic/live/advanced`, {
    method: "POST",
    headers: { Authorization: auth, "Content-Type": "application/json" },
    body: JSON.stringify([{
      keyword: query.keyword,
      location_name: locationName,
      language_code: "en",
      device: "mobile",
      os: "android",
      depth: 20,
    }]),
  });
  const payload = await response.json();
  const task = payload.tasks?.[0];
  if (!response.ok || payload.status_code !== 20000 || task?.status_code !== 20000) {
    throw new Error(`DataForSEO ${query.keyword}: HTTP ${response.status}; API ${payload.status_code}; task ${task?.status_code ?? "n/a"} ${task?.status_message ?? "n/a"}`);
  }
  const result = task.result?.[0] || {};
  const items = result.items || [];
  const itemTypeCounts = Object.fromEntries([...new Set(items.map((item) => item.type))].map((type) => [type, items.filter((item) => item.type === type).length]));
  report.results.push({
    ...query,
    cost: Number(task.cost || 0),
    check_url: result.check_url || null,
    item_type_counts: itemTypeCounts,
    local_pack: items.filter((item) => ["local_pack", "maps_search"].includes(item.type)),
    organic: items.filter((item) => item.type === "organic").slice(0, 20).map((item) => ({ rank_group: item.rank_group, rank_absolute: item.rank_absolute, domain: item.domain, url: item.url, title: item.title, description: item.description || null, breadcrumb: item.breadcrumb || null })),
    paid: items.filter((item) => ["paid", "shopping", "commercial_units"].includes(item.type)).map((item) => ({ type: item.type, rank_absolute: item.rank_absolute, domain: item.domain || null, url: item.url || null, title: item.title || null, description: item.description || null })),
    people_also_ask: items.filter((item) => item.type === "people_also_ask"),
  });
  report.cost = Number(report.results.reduce((sum, item) => sum + item.cost, 0).toFixed(6));
  await fs.writeFile(output, `${JSON.stringify(report, null, 2)}\n`);
}

console.log(JSON.stringify({ output, query_count: report.results.length, cost: report.cost, results: report.results.map(({ keyword, cost, item_type_counts, organic }) => ({ keyword, cost, item_type_counts, organic_domains: organic.slice(0, 10).map((item) => item.domain) })) }, null, 2));
