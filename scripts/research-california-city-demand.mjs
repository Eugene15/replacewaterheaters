import fs from "node:fs/promises";
import path from "node:path";

const username = process.env.DATAFORSEO_USERNAME;
const password = process.env.DATAFORSEO_PASSWORD;
const baseUrl = process.env.DATAFORSEO_BASE_URL || "https://api.dataforseo.com/v3";
if (!username || !password) throw new Error("DataForSEO credentials are required.");

const markets = {
  "Sacramento / Placer": [
    "Sacramento", "Roseville", "Rocklin", "Lincoln", "Auburn", "Folsom", "Citrus Heights",
    "Elk Grove", "Rancho Cordova", "Granite Bay", "Loomis", "Carmichael", "Fair Oaks",
    "Orangevale", "El Dorado Hills",
  ],
  "Bay Area": [
    "San Francisco", "San Jose", "Oakland", "Fremont", "Hayward", "Berkeley", "San Mateo",
    "Redwood City", "Daly City", "South San Francisco", "Palo Alto", "Mountain View", "Sunnyvale",
    "Santa Clara", "Alameda", "San Leandro", "Union City", "Dublin", "Pleasanton", "Livermore",
    "Richmond", "Concord", "Walnut Creek", "San Ramon", "Danville", "Pleasant Hill", "Martinez",
    "Antioch", "Brentwood", "Burlingame", "Millbrae", "San Bruno", "Belmont", "San Carlos",
    "Menlo Park", "Pacifica", "Foster City", "Half Moon Bay", "San Rafael", "Novato", "Mill Valley",
    "Sausalito", "Petaluma", "Santa Rosa", "Napa", "Vallejo", "Fairfield", "Vacaville",
  ],
  "Los Angeles County": [
    "Los Angeles", "Burbank", "Glendale", "Pasadena", "Santa Monica", "Beverly Hills", "Culver City",
    "West Hollywood", "Inglewood", "Hawthorne", "Malibu", "Calabasas", "Agoura Hills", "Westlake Village",
    "El Segundo", "Manhattan Beach", "Hermosa Beach", "Redondo Beach", "Torrance", "Rancho Palos Verdes",
    "San Fernando", "Santa Clarita", "Lancaster", "Palmdale", "La Canada Flintridge", "Long Beach", "Downey",
    "Whittier", "Alhambra", "Arcadia", "Monterey Park", "San Gabriel", "West Covina", "Pomona", "Diamond Bar",
    "Cerritos", "Lakewood", "North Hollywood", "Hollywood", "Van Nuys", "Sherman Oaks", "Studio City", "Encino",
    "Woodland Hills", "Northridge", "West Los Angeles",
  ],
  "Orange County": [
    "Anaheim", "Irvine", "Santa Ana", "Huntington Beach", "Costa Mesa", "Newport Beach", "Orange", "Fullerton",
    "Garden Grove", "Mission Viejo", "Buena Park", "Tustin", "Westminster", "Fountain Valley", "Lake Forest",
    "Yorba Linda", "Brea", "La Habra", "Placentia", "Cypress", "Aliso Viejo", "Laguna Niguel", "Laguna Beach",
    "Dana Point", "San Clemente", "San Juan Capistrano", "Rancho Santa Margarita",
  ],
  "San Diego County": [
    "San Diego", "Chula Vista", "Oceanside", "Escondido", "Carlsbad", "El Cajon", "Vista", "San Marcos",
    "Encinitas", "La Mesa", "Santee", "Poway", "National City", "Imperial Beach", "Coronado", "Del Mar",
    "Solana Beach", "Lemon Grove", "Fallbrook", "Rancho Santa Fe", "Lakeside", "Ramona", "Spring Valley", "Valley Center",
  ],
  "Ventura County": [
    "Ventura", "Oxnard", "Thousand Oaks", "Simi Valley", "Camarillo", "Moorpark", "Port Hueneme", "Santa Paula", "Ojai", "Fillmore",
  ],
  "Santa Barbara County": [
    "Santa Barbara", "Goleta", "Carpinteria", "Montecito", "Santa Maria", "Lompoc", "Buellton", "Solvang",
  ],
};

const keywordMeta = Object.entries(markets).flatMap(([region, cities]) => cities.flatMap((city) => [
  { region, city, variant: "city", keyword: `water heater replacement ${city}`.toLowerCase() },
  { region, city, variant: "city_ca", keyword: `water heater replacement ${city} ca`.toLowerCase() },
]));
const regional = ["bay area", "orange county", "los angeles county", "san diego county", "ventura county", "santa barbara county"]
  .map((place) => ({ region: "Regional", city: place, variant: "region", keyword: `water heater replacement ${place}` }));
const requested = [...keywordMeta, ...regional];

const response = await fetch(`${baseUrl}/keywords_data/google_ads/search_volume/live`, {
  method: "POST",
  headers: {
    Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify([{
    keywords: requested.map(({ keyword }) => keyword),
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
const resultMap = new Map((task.result || []).map((item) => [String(item.keyword).toLowerCase(), item]));
const rows = requested.map((meta) => {
  const item = resultMap.get(meta.keyword.toLowerCase()) || {};
  return {
    ...meta,
    search_volume: item.search_volume ?? 0,
    cpc: item.cpc ?? 0,
    competition: item.competition ?? null,
    competition_index: item.competition_index ?? null,
    monthly_searches: item.monthly_searches ?? [],
  };
}).sort((a, b) => b.search_volume - a.search_volume || b.cpc - a.cpc || a.keyword.localeCompare(b.keyword));

const citySummary = Object.entries(markets).flatMap(([region, cities]) => cities.map((city) => {
  const variants = rows.filter((row) => row.region === region && row.city === city);
  const strongest = [...variants].sort((a, b) => b.search_volume - a.search_volume || b.cpc - a.cpc)[0];
  return { region, city, best_keyword: strongest.keyword, search_volume: strongest.search_volume, cpc: strongest.cpc, competition: strongest.competition };
})).sort((a, b) => b.search_volume - a.search_volume || b.cpc - a.cpc || a.city.localeCompare(b.city));

const requestedAt = new Date().toISOString();
const report = {
  requested_at: requestedAt,
  provider: "DataForSEO Google Ads Search Volume Live",
  location: "United States",
  cost: Number(task.cost || payload.cost || 0),
  requested_keywords: requested.length,
  city_summary: citySummary,
  rows,
};
const outDir = path.resolve("research", "dataforseo", requestedAt.slice(0, 10));
await fs.mkdir(outDir, { recursive: true });
const output = path.join(outDir, "california-city-demand.json");
await fs.writeFile(output, `${JSON.stringify(report, null, 2)}\n`);
process.stdout.write(JSON.stringify({ output, requested: requested.length, cities: citySummary.length, cost: report.cost }, null, 2));
