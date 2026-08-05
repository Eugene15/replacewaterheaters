import fs from "node:fs/promises";
import path from "node:path";

const username = process.env.DATAFORSEO_USERNAME;
const password = process.env.DATAFORSEO_PASSWORD;
const baseUrl = process.env.DATAFORSEO_BASE_URL || "https://api.dataforseo.com/v3";
if (!username || !password) throw new Error("DataForSEO credentials are required.");

const dateDir = path.resolve("research", "dataforseo", "2026-08-05");
const taskFile = path.join(dateDir, "standard-geo-volume-tasks.json");
const taskManifest = JSON.parse(await fs.readFile(taskFile, "utf8"));
const collectedFile = path.join(dateDir, "standard-geo-volume-collected.json");
let collected = { updated_at: null, keyword_count: taskManifest.keyword_count, markets: [] };
try { collected = JSON.parse(await fs.readFile(collectedFile, "utf8")); } catch {}
const byId = new Map(collected.markets.map((entry) => [entry.id, entry]));

for (const task of taskManifest.tasks) {
  if (byId.get(task.id)?.ready) continue;
  const response = await fetch(`${baseUrl}/keywords_data/google_ads/search_volume/task_get/${task.id}`, {
    headers: { Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}` },
  });
  const payload = await response.json();
  const apiTask = payload.tasks?.[0];
  const ready = apiTask?.status_code === 20000 && Array.isArray(apiTask.result);
  byId.set(task.id, {
    ...task,
    ready,
    status_code: apiTask?.status_code ?? payload.status_code,
    status_message: apiTask?.status_message ?? payload.status_message,
    result: ready ? apiTask.result : null,
  });
}

collected = { updated_at: new Date().toISOString(), keyword_count: taskManifest.keyword_count, markets: [...byId.values()] };
await fs.writeFile(collectedFile, `${JSON.stringify(collected, null, 2)}\n`);
console.log(JSON.stringify({ output: collectedFile, ready: collected.markets.filter((item) => item.ready).length, pending: collected.markets.filter((item) => !item.ready).length, statuses: collected.markets.filter((item) => !item.ready).map(({ market, status_code, status_message }) => ({ market, status_code, status_message })) }, null, 2));
