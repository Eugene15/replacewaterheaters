import fs from "node:fs/promises";
import path from "node:path";

const username = process.env.DATAFORSEO_USERNAME;
const password = process.env.DATAFORSEO_PASSWORD;
const baseUrl = process.env.DATAFORSEO_BASE_URL || "https://api.dataforseo.com/v3";
if (!username || !password) throw new Error("DataForSEO credentials are required.");

const markets = [
  { market: "Sacramento", location_name: "Sacramento,California,United States" },
  { market: "San Diego", location_name: "San Diego,California,United States" },
  { market: "San Jose", location_name: "San Jose,California,United States" },
  { market: "Huntington Beach", location_name: "Huntington Beach,California,United States" },
  { market: "Orange County", location_name: "Orange County,California,United States" },
  { market: "Livermore", location_name: "Livermore,California,United States" },
  { market: "San Francisco", location_name: "San Francisco,California,United States" },
  { market: "Fremont", location_name: "Fremont,California,United States" },
  { market: "Los Angeles", location_name: "Los Angeles,California,United States" },
  { market: "Folsom", location_name: "Folsom,California,United States" },
  { market: "Roseville", location_name: "Roseville,California,United States" },
  { market: "San Mateo", location_name: "San Mateo,California,United States" },
  { market: "Sunnyvale", location_name: "Sunnyvale,California,United States" },
  { market: "Santa Monica", location_name: "Santa Monica,California,United States" },
  { market: "Chula Vista", location_name: "Chula Vista,California,United States" },
  { market: "Carlsbad", location_name: "Carlsbad,California,United States" },
  { market: "Thousand Oaks", location_name: "Thousand Oaks,California,United States" },
];
const marketStartIndex = Number(process.env.MARKET_START_INDEX || 0);
const selectedMarkets = markets.slice(marketStartIndex);

const csvPath = path.resolve("DATAFORSEO_LIVE_KEYWORDS_REVIEW.csv");
const lines = (await fs.readFile(csvPath, "utf8")).trim().split(/\r?\n/);
const keywords = lines.slice(1).map((line) => {
  const [category, cluster, ...keywordParts] = line.split(",");
  return { category, cluster, keyword: keywordParts.join(",").trim() };
}).filter((row) => row.keyword);
if (keywords.length > 1000) throw new Error(`Keyword limit exceeded: ${keywords.length}`);

const marketReports = [];
const requestedAt = new Date().toISOString();
const outDir = path.resolve("research", "dataforseo", requestedAt.slice(0, 10));
await fs.mkdir(outDir, { recursive: true });
const checkpointOutput = path.join(outDir, `all-services-geo-volume-checkpoint-from-${marketStartIndex}.json`);
for (const market of selectedMarkets) {
  const response = await fetch(`${baseUrl}/keywords_data/google_ads/search_volume/live`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([{
      keywords: keywords.map(({ keyword }) => keyword),
      location_name: market.location_name,
      language_code: "en",
      search_partners: false,
      include_adult_keywords: false,
    }]),
  });
  const payload = await response.json();
  const task = payload.tasks?.[0];
  if (!response.ok || payload.status_code !== 20000 || task?.status_code !== 20000) {
    throw new Error(`DataForSEO request failed for ${market.market}: HTTP ${response.status}; API ${payload.status_code}; task ${task?.status_code ?? "n/a"} ${task?.status_message ?? "n/a"}`);
  }

  const resultMap = new Map((task.result || []).map((item) => [String(item.keyword).toLowerCase(), item]));
  const rows = keywords.map((entry) => {
    const item = resultMap.get(entry.keyword.toLowerCase()) || {};
    return {
      ...entry,
      search_volume: item.search_volume ?? 0,
      cpc: item.cpc ?? 0,
      competition: item.competition ?? null,
      competition_index: item.competition_index ?? null,
      low_top_of_page_bid: item.low_top_of_page_bid ?? null,
      high_top_of_page_bid: item.high_top_of_page_bid ?? null,
      monthly_searches: item.monthly_searches ?? [],
    };
  });
  marketReports.push({
    ...market,
    cost: Number(task.cost || 0),
    returned_keywords: task.result?.length || 0,
    rows,
  });
  await fs.writeFile(checkpointOutput, `${JSON.stringify({
    requested_at: requestedAt,
    market_start_index: marketStartIndex,
    keyword_count: keywords.length,
    completed_markets: marketReports,
  }, null, 2)}\n`);
}

const report = {
  requested_at: requestedAt,
  provider: "DataForSEO Google Ads Search Volume Live",
  source_keywords: csvPath,
  methodology: "The same generic, city-free keyword list is measured separately with each California city/county supplied as the Google Ads location. Similar variants may share Google Ads volume and must not be blindly summed.",
  keyword_count: keywords.length,
  market_count: selectedMarkets.length,
  total_cost: marketReports.reduce((sum, item) => sum + item.cost, 0),
  markets: marketReports,
};
const output = path.join(outDir, `all-services-geo-volume-from-${marketStartIndex}.json`);
await fs.writeFile(output, `${JSON.stringify(report, null, 2)}\n`);

process.stdout.write(JSON.stringify({
  output,
  keyword_count: report.keyword_count,
  market_count: report.market_count,
  total_cost: report.total_cost,
  markets: marketReports.map(({ market, cost, returned_keywords }) => ({ market, cost, returned_keywords })),
}, null, 2));
