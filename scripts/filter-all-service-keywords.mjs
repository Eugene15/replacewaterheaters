import fs from "node:fs/promises";
import path from "node:path";

const inputPath = path.resolve("research", "dataforseo", "2026-08-05", "all-services-keyword-ideas.json");
const masterPath = path.resolve("DATAFORSEO_LIVE_KEYWORDS.csv");
const outputDir = path.resolve("research", "dataforseo", "2026-08-05");
const report = JSON.parse(await fs.readFile(inputPath, "utf8"));
const masterLines = (await fs.readFile(masterPath, "utf8")).trim().split(/\r?\n/).slice(1);
const existing = new Set(masterLines.map((line) => line.split(",").slice(2).join(",").trim().toLowerCase()).filter(Boolean));

const placeNoise = /\b(alabama|alaska|arizona|arkansas|california|colorado|connecticut|delaware|florida|georgia|hawaii|idaho|illinois|indiana|iowa|kansas|kentucky|louisiana|maine|maryland|massachusetts|michigan|minnesota|mississippi|missouri|montana|nebraska|nevada|ohio|oklahoma|oregon|pennsylvania|tennessee|texas|utah|vermont|virginia|washington|wisconsin|wyoming|atlanta|austin|baltimore|boston|charlotte|chicago|cincinnati|cleveland|columbus|dallas|denver|detroit|houston|indianapolis|jacksonville|kansas city|las vegas|miami|milwaukee|minneapolis|nashville|new orleans|new york|oklahoma city|orlando|philadelphia|phoenix|pittsburgh|portland|raleigh|richmond|salt lake city|san antonio|seattle|st louis|tampa)\b/i;
const infoNoise = /\b(how to|diy|ideas?|pictures?|images?|inspiration|tutorial|classes?|course|training|jobs?|salary|career|meaning|definition|supplies|tools?|calculator|software|template|license requirements|before and after|reviews?|reddit)\b/i;
const retailerBrandNoise = /\b(home depot|lowe'?s|amazon|walmart|menards|ace hardware|sherwin williams|benjamin moore|behr|dunn edwards|ppg|certapro|rheem|rinnai|navien|bradford white|ao smith|1-800-flowers|1800 flowers|ftd|teleflora|proflowers|edible arrangements|trader joe'?s|costco|whole foods)\b/i;

const rules = {
  water_heater: {
    include: /\b(water heater|hot water heater)\b.*\b(replace|replacement|install|installation|installer|contractor|company|service|quote|estimate|cost|price|conversion|convert)\b|\b(replace|replacement|install|installation|installer|contractor|company|service|quote|estimate|cost|price|conversion|convert)\b.*\b(water heater|hot water heater)\b/i,
    exclude: /\b(repair|maintenance|flush|flushing|anode|expansion tank|thermocouple|element|valve|part|parts|leak repair|tank size|gallon|lifespan|life expectancy|age|manual|warranty|recall|rv|pool|spa|commercial|solar|vs)\b/i,
    cluster(keyword) {
      if (/tankless/.test(keyword)) return "tankless";
      if (/heat pump|hybrid/.test(keyword)) return "heat_pump";
      if (/\bgas\b/.test(keyword)) return "gas";
      if (/\belectric\b/.test(keyword)) return "electric";
      if (/cost|price|quote|estimate/.test(keyword)) return "cost";
      if (/conversion|convert/.test(keyword)) return "conversion";
      if (/install/.test(keyword)) return "installation";
      return "replacement";
    },
  },
  painting_interior: {
    include: /\b(interior|indoor|inside|room|wall|ceiling|trim|baseboard)\b.*\b(painter|painters|painting (?:service|services|company|companies|contractor|contractors|quote|estimate|cost|prices?))\b|\b(interior (?:house |home |wall )?(?:painter|painters|painting))\b/i,
    exclude: /\b(exterior|commercial|industrial|cabinet|cupboard|furniture|floor|garage floor|car|auto|art|canvas|decor|decorative|mural|face|body|nail|drywall repair|remodel|spray machine|101)\b|\bnear$/i,
    cluster(keyword) {
      if (/cost|price|quote|estimate/.test(keyword)) return "cost";
      if (/wall|ceiling|trim|baseboard|room/.test(keyword)) return "rooms";
      if (/company|companies|contractor/.test(keyword)) return "provider";
      return "service";
    },
  },
  painting_exterior: {
    include: /\b(exterior|outside|house|home|residential|stucco|siding|brick|trim|front door|garage door)\b.*\b(painter|painters|painting (?:service|services|company|companies|contractor|contractors|quote|estimate|cost|prices?))\b|\b(exterior (?:house |home |wall )?(?:painter|painters|painting))\b|\b(house|residential) painting services?\b|\bpainting (?:company|companies|contractor|contractors|services?)\b/i,
    exclude: /\b(interior|commercial|industrial|cabinet|cupboard|furniture|fence|deck|roof|floor|garage|car|auto|boat|art|canvas|mural|face|body|nail|paint and sip|painting with a twist|pressure washing|repair|remodel)\b/i,
    cluster(keyword) {
      if (/cost|price|quote|estimate/.test(keyword)) return "cost";
      if (/stucco|siding|brick|trim|door/.test(keyword)) return "surface";
      if (/company|companies|contractor/.test(keyword)) return "provider";
      if (/house|home|residential/.test(keyword)) return "residential";
      return "service";
    },
  },
  wallpaper: {
    include: /\b(wallpaper|wall paper|wallcovering|wall covering|wall mural|grasscloth)\b.*\b(installer|installers|installation|hanger|hangers|hanging|contractor|company|service|quote|estimate|cost|price)\b|\b(installer|installers|installation|hanger|hangers|hanging|contractor|company|service|quote|estimate|cost|price)\b.*\b(wallpaper|wall paper|wallcovering|wall covering|wall mural|grasscloth)\b/i,
    exclude: /\b(removal|remove|strip|repair|desktop|phone|iphone|ipad|computer|laptop|4k|background|download|app|screen|book|story|movie|anime|game|store|shop|sale|roll|adhesive|paste|tool|supplies)\b/i,
    cluster(keyword) {
      if (/cost|price|quote|estimate/.test(keyword)) return "cost";
      if (/peel and stick|mural|grasscloth|wallcovering|wall covering/.test(keyword)) return "type";
      if (/contractor|company/.test(keyword)) return "provider";
      return "core";
    },
  },
  floristry: {
    include: /\b(florist|flower shop|flower delivery|flowers delivery|deliver flowers|send flowers|same day flowers?|same day flower delivery|bouquet delivery|rose delivery|roses delivery|wedding flowers?|wedding florist|event flowers?|event florist|funeral flowers?|sympathy flowers?|birthday flowers?|anniversary flowers?|get well flowers?|new baby flowers?|housewarming flowers?|thank you flowers?|valentine'?s? flowers?|mother'?s day flowers?|prom flowers?|corsage|boutonniere|bridal bouquet|flower bouquet|floral arrangement|flower arrangement|floral centerpiece|flower centerpiece)\b/i,
    exclude: /\b(drawing|clipart|tattoo|meaning|types of|names|seeds?|plants?|bulbs?|garden|growing|how to|diy|ideas?|pictures?|images?|dress|venue|planner|invitation|movie|song|lyrics|book|wholesale|artificial|fake|lego|coloring|wallpaper|field|farm|preservation|preserve|1800)\b/i,
    cluster(keyword) {
      if (/wedding|bridal|boutonniere|corsage|prom/.test(keyword)) return "wedding_event";
      if (/funeral|sympathy/.test(keyword)) return "sympathy";
      if (/birthday|anniversary|get well|new baby|housewarming|thank you|valentine|mother/.test(keyword)) return "occasion";
      if (/delivery|deliver|send/.test(keyword)) return "delivery";
      if (/bouquet|arrangement|centerpiece/.test(keyword)) return "arrangements";
      return "core";
    },
  },
};

// Keyword Ideas is intentionally broad. Requiring a controlled service vocabulary
// removes city names, brands, products, and informational modifiers that regexes
// alone cannot reliably identify.
const allowedVocabulary = {
  water_heater: `water heater heaters hot tank tanks tankless electric electricity gas natural propane heat pump hybrid replacement replace replacing installation install installing installer installers service services company companies contractor contractors cost costs price prices quote quotes estimate estimates near me local professional residential home house same day emergency urgent hour today conversion convert to vs new old removal disposal haul away permit permits code upgrade upgrades rebate rebates financing licensed`.split(" "),
  painting_interior: `interior indoor inside house home residential wall walls room rooms bedroom bedrooms bathroom bathrooms kitchen kitchens living dining ceiling ceilings trim baseboard baseboards door doors painter painters painting service services company companies contractor contractors cost costs price prices estimate estimates quote quotes local professional affordable cheap near me whole full apartment apartments condo condos townhouse townhouses move moving in out vacant rental rentals`.split(" "),
  painting_exterior: `exterior outside house home residential wall walls stucco siding brick wood trim door doors front garage painter painters painting service services company companies contractor contractors cost costs price prices estimate estimates quote quotes local professional affordable cheap near me whole full`.split(" "),
  wallpaper: `wallpaper wallpapers wall paper wallcovering wallcoverings covering coverings installer installers installation install installing hanger hangers hanging contractor contractors company companies service services professional local residential home house room rooms accent peel and stick mural murals grasscloth textured vinyl custom cost costs price prices estimate estimates quote quotes near me`.split(" "),
  floristry: `flower flowers florist florists floral shop shops delivery deliveries deliver delivered send sending online local same day today near me cheap affordable best fresh bouquet bouquets arrangement arrangements centerpiece centerpieces wedding weddings bridal event events funeral funerals sympathy birthday birthdays anniversary anniversaries get well new baby housewarming thank you thanks valentine valentines mother's mothers day rose roses romantic apology congratulations corporate luxury personalized custom prom corsage corsages boutonniere boutonnieres gift gifts for someone order ordering service services same-day`.split(" "),
};
const allowedSets = Object.fromEntries(Object.entries(allowedVocabulary).map(([key, words]) => [key, new Set(words)]));
const vocabularyAllowed = (category, keyword) => {
  const tokens = keyword.toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9'-]+/g, " ").trim().split(/\s+/);
  return tokens.every((token) => /^\d+$/.test(token) || allowedSets[category].has(token));
};

const candidates = [];
const stats = [];
for (const group of report.groups) {
  const rule = rules[group.id];
  const accepted = [];
  for (const row of group.rows) {
    const keyword = row.keyword.trim().toLowerCase();
    if (!row.search_volume || row.search_volume <= 0) continue;
    if (existing.has(keyword)) continue;
    if (placeNoise.test(keyword) || infoNoise.test(keyword) || retailerBrandNoise.test(keyword)) continue;
    if (!rule.include.test(keyword) || rule.exclude.test(keyword) || !vocabularyAllowed(group.id, keyword)) continue;
    existing.add(keyword);
    accepted.push({
      category: group.id,
      cluster: rule.cluster(keyword),
      keyword,
      us_volume: row.search_volume,
      cpc: row.cpc,
      intent: row.intent,
    });
  }
  accepted.sort((a, b) => b.us_volume - a.us_volume || b.cpc - a.cpc || a.keyword.localeCompare(b.keyword));
  candidates.push(...accepted);
  stats.push({ category: group.id, accepted: accepted.length });
}

const escapeCsv = (value) => {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
};
const csvRows = ["category,cluster,keyword,us_volume,cpc,intent"];
for (const row of candidates) csvRows.push([row.category, row.cluster, row.keyword, row.us_volume, row.cpc, row.intent].map(escapeCsv).join(","));
await fs.writeFile(path.join(outputDir, "all-services-filtered-candidates.csv"), `${csvRows.join("\n")}\n`);

const summary = {
  generated_at: new Date().toISOString(),
  source: inputPath,
  existing_master_keywords: masterLines.length,
  new_candidates: candidates.length,
  projected_total: masterLines.length + candidates.length,
  stats,
};
await fs.writeFile(path.join(outputDir, "all-services-filter-summary.json"), `${JSON.stringify(summary, null, 2)}\n`);
console.log(JSON.stringify(summary, null, 2));
