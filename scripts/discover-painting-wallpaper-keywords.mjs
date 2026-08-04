import fs from "node:fs/promises";
import path from "node:path";

const username = process.env.DATAFORSEO_USERNAME;
const password = process.env.DATAFORSEO_PASSWORD;
const baseUrl = process.env.DATAFORSEO_BASE_URL || "https://api.dataforseo.com/v3";
if (!username || !password) throw new Error("DataForSEO credentials are required.");

const services = [
  { id: "interior_painting", seed: "interior house painting" },
  { id: "exterior_painting", seed: "exterior house painting" },
  { id: "wallpaper_installation", seed: "wallpaper installation" },
];

const tasks = [];
for (const { seed } of services) {
  const response = await fetch(`${baseUrl}/dataforseo_labs/google/keyword_ideas/live`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([{
      keywords: [seed],
      location_name: "United States",
      language_code: "en",
      include_serp_info: true,
      limit: 1000,
    }]),
  });
  const payload = await response.json();
  const task = payload.tasks?.[0];
  if (!response.ok || payload.status_code !== 20000 || task?.status_code !== 20000) {
    throw new Error(`DataForSEO request failed for ${seed}: HTTP ${response.status}; API ${payload.status_code}; task ${task?.status_code ?? "n/a"} ${task?.status_message ?? "n/a"}`);
  }
  tasks.push(task);
}

const informationalNoise = /\b(how to|diy|ideas?|colors?|pictures?|images?|inspiration|tutorial|course|classes|jobs?|salary|resume|meaning|definition|supplies|tools?|machine|sprayer|brush|roller|tape|calculator|app|software|training|school|license requirements|paintings|artist|artwork|canvas|miniature|car|auto|automotive|boat|aircraft|nails?|face|body|warhammer|home depot|lowe'?s|amazon|walmart)\b/i;
const outOfScope = /\b(cabinet|cupboard|furniture|fence|deck|roof|floor|garage floor|commercial|industrial|mural|popcorn ceiling|drywall repair|stucco repair|pressure washing|removal)\b/i;
const serviceSignals = /\b(painter|painters|painting|paint service|painting service|painting company|painting contractor|wallpaper install|wallpaper installer|wallpaper installation|wallpaper hanger|wall paper install|wall paper hanger|wallcovering install)\b/i;

const reports = services.map((service, index) => {
  const task = tasks[index];
  const items = task?.result?.[0]?.items || [];
  const rows = items.map((item) => {
    const data = item.keyword_data || item;
    const info = data.keyword_info || {};
    const keyword = String(data.keyword || item.keyword || "").trim().toLowerCase();
    const relevant = serviceSignals.test(keyword) && !informationalNoise.test(keyword) && !outOfScope.test(keyword);
    return {
      keyword,
      search_volume: info.search_volume ?? 0,
      cpc: info.cpc ?? 0,
      competition: info.competition ?? null,
      competition_level: info.competition_level ?? null,
      intent: data.search_intent_info?.main_intent ?? null,
      relevant_commercial_service: relevant,
      monthly_searches: info.monthly_searches ?? [],
    };
  }).filter((row) => row.keyword)
    .sort((a, b) => b.search_volume - a.search_volume || b.cpc - a.cpc || a.keyword.localeCompare(b.keyword));

  return {
    ...service,
    cost: Number(task?.cost || 0),
    returned_keywords: rows.length,
    relevant_with_demand: rows.filter((row) => row.relevant_commercial_service && row.search_volume > 0).length,
    rows,
  };
});

const requestedAt = new Date().toISOString();
const report = {
  requested_at: requestedAt,
  provider: "DataForSEO Labs Google Keyword Ideas Live",
  location: "United States",
  services: reports,
  cost: reports.reduce((sum, reportItem) => sum + reportItem.cost, 0),
};

const outDir = path.resolve("research", "dataforseo", requestedAt.slice(0, 10));
await fs.mkdir(outDir, { recursive: true });
const output = path.join(outDir, "painting-wallpaper-keyword-ideas.json");
await fs.writeFile(output, `${JSON.stringify(report, null, 2)}\n`);

process.stdout.write(JSON.stringify({
  output,
  cost: report.cost,
  services: reports.map(({ id, seed, returned_keywords, relevant_with_demand, cost }) => ({ id, seed, returned_keywords, relevant_with_demand, cost })),
}, null, 2));
