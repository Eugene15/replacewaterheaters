import fs from "node:fs/promises";
import path from "node:path";

const username = process.env.DATAFORSEO_USERNAME;
const password = process.env.DATAFORSEO_PASSWORD;
const baseUrl = process.env.DATAFORSEO_BASE_URL || "https://api.dataforseo.com/v3";
if (!username || !password) throw new Error("DataForSEO credentials are required.");

const markets = [
  ["Sacramento", "Sacramento,California,United States"],
  ["San Diego", "San Diego,California,United States"],
  ["San Jose", "San Jose,California,United States"],
  ["Huntington Beach", "Huntington Beach,California,United States"],
  ["Orange County", "Orange County,California,United States"],
  ["Livermore", "Livermore,California,United States"],
  ["San Francisco", "San Francisco,California,United States"],
  ["Fremont", "Fremont,California,United States"],
  ["Los Angeles", "Los Angeles,California,United States"],
  ["Folsom", "Folsom,California,United States"],
  ["Roseville", "Roseville,California,United States"],
  ["San Mateo", "San Mateo,California,United States"],
  ["Sunnyvale", "Sunnyvale,California,United States"],
];

const csvLines = (await fs.readFile(path.resolve("DATAFORSEO_LIVE_KEYWORDS_REVIEW.csv"), "utf8")).trim().split(/\r?\n/);
const keywords = csvLines.slice(1).map((line) => line.split(",").slice(2).join(",").trim()).filter(Boolean);
const postData = markets.map(([market, location_name]) => ({
  keywords,
  location_name,
  language_code: "en",
  search_partners: false,
  include_adult_keywords: false,
  tag: `all-services-geo-${market.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
}));

const response = await fetch(`${baseUrl}/keywords_data/google_ads/search_volume/task_post`, {
  method: "POST",
  headers: {
    Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(postData),
});
const payload = await response.json();
if (!response.ok || payload.status_code !== 20000 || payload.tasks?.some((task) => task.status_code !== 20100)) {
  throw new Error(`Task POST failed: HTTP ${response.status}; API ${payload.status_code}; ${JSON.stringify(payload.tasks?.map(({ status_code, status_message }) => ({ status_code, status_message })))}`);
}

const tasks = payload.tasks.map((task, index) => ({
  market: markets[index][0],
  location_name: markets[index][1],
  id: task.id,
  status_code: task.status_code,
  status_message: task.status_message,
  cost: Number(task.cost || 0),
}));
const requestedAt = new Date().toISOString();
const output = path.resolve("research", "dataforseo", requestedAt.slice(0, 10), "standard-geo-volume-tasks.json");
await fs.mkdir(path.dirname(output), { recursive: true });
await fs.writeFile(output, `${JSON.stringify({ requested_at: requestedAt, keyword_count: keywords.length, total_cost: tasks.reduce((sum, task) => sum + task.cost, 0), tasks }, null, 2)}\n`);
console.log(JSON.stringify({ output, keyword_count: keywords.length, total_cost: tasks.reduce((sum, task) => sum + task.cost, 0), tasks }, null, 2));
