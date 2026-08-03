# Wellmade Water Heater Service — SEO strategy and research record

Updated: 2026-08-03  
Website: https://replacewaterheaters.com/  
Primary conversion: phone call or service request to **(916) 265-7756**

This file is the source of truth for the approved organic-search structure and the DataForSEO research completed on 2026-08-03. Raw API responses are preserved under `research/dataforseo/2026-08-03/`.

## 1. Fixed business and content constraints

- Service offered: **water heater replacement only**.
- Do not create or optimize pages for water heater repair.
- Supported types can be mentioned as service options: tank, tankless, gas, electric, and heat pump.
- Same-day availability can be mentioned, but it is not a separate SEO page at this stage.
- Do not publish claims about licensing, warranties, reviews, ratings, or years in business until verified business information is supplied.
- Do not target product-shopping or informational intent such as capacities, lifespan, or brand-only searches.
- Specifically excluded from the commercial SEO structure:
  - `40 gallon water heater`
  - `50 gallon water heater`
  - `water heater lifespan`
  - `how long does a water heater last`
  - Rheem, Bradford White, AO Smith, Rinnai, and Navien brand pages

## 2. Research methodology

The research was not based on guessed city combinations alone. It used DataForSEO keyword discovery, keyword ideas, Google Ads search-volume data, and localized Google SERP requests.

Important interpretation rules:

1. Search volume is monthly Google Ads keyword volume returned by DataForSEO for the configured United States/English dataset.
2. Close variants such as `water heater replacement sacramento`, `water heater replacement sacramento ca`, and `water heater replacement in sacramento` must not be added together. They represent the same intent cluster.
3. Market totals below sum only distinct commercial clusters: replacement, installation, cost, and tankless. They do not double-count close word-order or `CA` variants.
4. A reported zero does not mean nobody ever searches the phrase. It means DataForSEO did not report measurable volume at its available granularity.
5. CPC and Google Ads competition are commercial indicators, not organic-ranking difficulty scores.
6. Local SERPs must be checked through the Google SERP API with a city-level location. Keyword Ideas does not reproduce a city-specific results page.

## 3. Sacramento findings

### Confirmed primary cluster

| Keyword / cluster representative | Monthly volume | CPC | Ads competition | Decision |
| --- | ---: | ---: | --- | --- |
| `water heater replacement sacramento` | 170 | $32.62 | High | Homepage primary target |
| `water heater installation sacramento` | 70 | $24.52 | Medium | Secondary intent on homepage |
| `water heater replacement cost sacramento` | 30 | $14.09 | High | Cost section and FAQ on homepage |
| `tankless water heater sacramento` | 40 | — | — | Tankless section on homepage; consider a service page later |

Distinct confirmed Sacramento commercial demand: **310 searches/month**.

Close variants with the same replacement intent also returned 170 and must not be summed:

- `water heater replacement in sacramento`
- `water heater replacement sacramento ca`
- `sacramento water heater replacement`

### Validated long tails

| Keyword | Monthly volume | Decision |
| --- | ---: | --- |
| `same day water heater replacement sacramento` | 0 | Use supporting copy, not a standalone page |
| `gas water heater replacement sacramento` | 0 | Use as an on-page section/detail |
| `electric water heater replacement sacramento` | 0 | Use as an on-page section/detail |
| `heat pump water heater replacement sacramento` | 0 | Use as an on-page section/detail |
| `water heater replacement auburn ca` | 0 in this validation set | Use the better-performing city form from the expanded city study |
| `water heater replacement granite bay` | 0 | Do not prioritize until demand or business evidence supports it |
| `water heater replacement lincoln ca` | 0 in this form | Expanded study found 20 for `water heater replacement lincoln` |
| `water heater replacement loomis ca` | 0 | Do not prioritize yet |
| `water heater replacement rocklin` | 0 | Do not prioritize yet |
| `water heater replacement roseville` | 20 | Approved city-page target |

## 4. Approved market list and total distinct cluster volume

The order below is the working rollout order previously selected. The total is the sum of the best non-duplicate keyword in each of four clusters: replacement + installation + cost + tankless.

| Order | Market | Replacement | Installation | Cost | Tankless | Total / month |
| ---: | --- | ---: | ---: | ---: | ---: | ---: |
| 1 | Sacramento | 170 | 70 | 30 | 40 | **310** |
| 2 | San Diego | 320 | 390 | 30 | 110 | **850** |
| 3 | San Jose | 110 | 170 | 10 | 20 | **310** |
| 4 | Huntington Beach | 70 | 50 | 0 | 10 | **130** |
| 5 | Orange County | 50 | 70 | 0 | 20 | **140** |
| 6 | Livermore | 70 | 70 | 0 | 10 | **150** |
| 7 | San Francisco | 40 | 20 | 10 | 10 | **80** |
| 8 | Fremont | 40 | 40 | 0 | 0 | **80** |
| 9 | Los Angeles | 30 | 70 | 10 | 30 | **140** |
| 10 | Folsom | 30 | 0 | 0 | 0 | **30** |
| 11 | Roseville | 20 | 40 | 0 | 10 | **70** |
| 12 | San Mateo | 20 | 20 | 0 | 0 | **40** |
| 13 | Sunnyvale | 20 | 0 | 0 | 0 | **20** |
| 14 | Santa Monica | 20 | 10 | 0 | 10 | **40** |
| 15 | Chula Vista | 20 | 10 | 0 | 10 | **40** |
| 16 | Carlsbad | 20 | 10 | 0 | 10 | **40** |
| 17 | Thousand Oaks | 90 | 10 | 0 | 10 | **110** |

Total across the 17 selected markets, without double-counting close variants: **2,580 searches/month**.

### Other city opportunities found

These are retained as a later backlog, not the initial launch list.

| Market / city | Best replacement keyword | Volume | Notes |
| --- | --- | ---: | --- |
| Hollywood | `water heater replacement hollywood` | 90 | LA County; verify service coverage and SERP ambiguity |
| Brentwood | `water heater replacement brentwood` | 70 | Bay Area; confirm California intent in SERP |
| Auburn | `water heater replacement auburn` | 20 | Sacramento/Placer expansion |
| Lincoln | `water heater replacement lincoln` | 20 | Sacramento/Placer expansion |
| Lakeside | `water heater replacement lakeside` | 20 | San Diego County expansion |
| Santee | `water heater replacement santee` | 20 | San Diego County expansion |
| Malibu | `water heater replacement malibu ca` | 10 | LA County; high CPC signal |
| Agoura Hills | `water heater replacement agoura hills ca` | 10 | LA County |
| Burbank | `water heater replacement burbank` | 10 | LA County |
| Glendale | `water heater replacement glendale` | 10 | LA County; verify California SERP |
| Beverly Hills | Use raw city dataset | 0–10 range | Recheck before publishing |
| Santa Barbara | Use raw city dataset | 0–10 range | Separate county/market; verify actual service coverage |

The expanded raw city study contains **362 keyword rows** covering Sacramento/Placer, Bay Area, Los Angeles County, Orange County, Ventura County, Santa Barbara County, and San Diego County. Use `california-city-demand.json` as the authoritative backlog rather than copying an incomplete city list into new templates.

## 5. Approved site architecture

Keep the architecture shallow. The homepage targets Sacramento because this is the current live market. City pages sit under one service-area hub. Do not create separate county, city, and neighborhood pages that all target the same replacement query.

```text
Homepage — Sacramento water heater replacement (/)
├── Water heater replacement service (/water-heater-replacement/)
│   └── Optional future tankless page (/tankless-water-heater-replacement/)
├── Service areas hub (/service-areas/)
│   ├── Roseville (/service-areas/roseville-ca/)
│   ├── Folsom (/service-areas/folsom-ca/)
│   ├── San Diego (/service-areas/san-diego-ca/)
│   ├── San Jose (/service-areas/san-jose-ca/)
│   ├── Huntington Beach (/service-areas/huntington-beach-ca/)
│   ├── Livermore (/service-areas/livermore-ca/)
│   ├── San Francisco (/service-areas/san-francisco-ca/)
│   ├── Fremont (/service-areas/fremont-ca/)
│   ├── Los Angeles (/service-areas/los-angeles-ca/)
│   ├── San Mateo (/service-areas/san-mateo-ca/)
│   ├── Sunnyvale (/service-areas/sunnyvale-ca/)
│   ├── Santa Monica (/service-areas/santa-monica-ca/)
│   ├── Chula Vista (/service-areas/chula-vista-ca/)
│   ├── Carlsbad (/service-areas/carlsbad-ca/)
│   └── Thousand Oaks (/service-areas/thousand-oaks-ca/)
├── About / company information (/about/) — only after facts are supplied
├── Contact / request service (/contact/)
└── Legal pages (/privacy/, /terms/)
```

### County and metro pages

- `Orange County`, `Los Angeles`, and `Bay Area` are not substitutes for individual city pages.
- A county/metro URL may be created as a navigational hub only when the business genuinely covers that area and the page has unique regional utility.
- Do not publish both a thin Orange County page and many identical Orange County city pages merely to multiply indexable URLs.
- Bay Area should be represented by real cities, not a single page pretending the entire region is one local market.
- Los Angeles County should be split into actual cities such as Los Angeles, Santa Monica, Burbank, Glendale, Malibu, Beverly Hills, and Agoura Hills only when coverage and unique content are confirmed.

## 6. City-page keyword mapping

Each city gets one primary commercial page.

| Element | Template |
| --- | --- |
| URL | `/service-areas/{city-slug}-ca/` |
| Primary keyword | `water heater replacement {city}` |
| Secondary keyword | `water heater installation {city}` |
| Supporting cluster | `water heater replacement cost {city}` |
| Supporting cluster | `tankless water heater {city}` |
| Supporting phrases | same-day availability, gas, electric, heat pump |
| Title | `Water Heater Replacement in {City}, CA | Wellmade` |
| H1 | `Water heater replacement in {City}` |
| Canonical | Self-referencing absolute URL |

Do not create separate gas, electric, heat-pump, same-day, installation, and cost pages for every city while their measured demand is zero or they share the same intent. Use sections and FAQs on the main city page. Split a cluster into a standalone page only after SERP evidence shows a different intent and the page can offer genuinely unique value.

## 7. Required city-page template

Every city page must contain meaningful local information, not city-name substitution.

1. Unique hero: city + replacement intent + phone/form CTA.
2. A unique local introduction describing service availability without unsupported claims.
3. Replacement options: tank, tankless, gas, electric, heat pump.
4. `Water heater installation in {City}` section.
5. Cost explanation specific to installation conditions; do not invent fixed prices.
6. Same-day scheduling explanation with availability disclaimer.
7. Local service-area section with real ZIP codes, neighborhoods, route considerations, housing characteristics, or permit/utility context that has been verified.
8. Process section: request, confirm equipment/site details, schedule replacement.
9. Four to six genuinely city-relevant FAQs.
10. Related nearby-city links and link back to the service-area hub.
11. Final call and request-service CTA.

Minimum quality rules:

- At least three verified local details per city page.
- Unique introduction, FAQ answers, service-area description, title, meta description, and internal-link set.
- No invented landmarks, service history, customer stories, licenses, warranties, reviews, or years of experience.
- No page should be indexable until its local content is complete.
- A page with only a changed city name is a doorway/thin page and must not be published.

## 8. Internal linking

- Homepage links to `/service-areas/` and the first-priority Sacramento-region pages.
- Service-area hub links to every published city page, grouped by metro/county.
- Every city page links back to the hub and to two to four genuinely adjacent cities.
- Breadcrumb: `Home > Service Areas > {City}`.
- Use descriptive anchors such as `water heater replacement in Roseville`, not `learn more`.
- Only published, complete city pages belong in navigation and the XML sitemap.
- No orphan pages.

## 9. Indexation rollout

1. Keep the current Sacramento homepage indexed.
2. Build the service-area hub.
3. Publish Roseville and Folsom first to establish a coherent Sacramento/Placer cluster.
4. Add markets in approved order only where the business truly serves customers.
5. Submit updated XML sitemap in Google Search Console.
6. Inspect each new URL and request indexing in small batches.
7. Track indexed/not-indexed status, impressions, clicks, calls, and form submissions by city.
8. Expand or consolidate pages that receive no impressions rather than mass-producing more thin pages.

Business coverage is a hard gate. Search volume alone does not authorize a page for a city the company cannot actually service.

## 10. Schema and technical requirements

- Homepage: `HomeAndConstructionBusiness`/appropriate LocalBusiness subtype using only verified fields.
- City pages: `Service` plus business entity reference; do not claim a physical address in every city.
- Breadcrumb structured data on all city pages.
- FAQ structured data only when the visible FAQ is present and eligible under current Google guidance.
- Unique title, description, H1, canonical, and social metadata for every page.
- Click-to-call phone in `tel:+19162657756` format.
- Fast mobile rendering, compressed images, no horizontal overflow.
- Separate XML sitemap entries for every published canonical page.

## 11. DataForSEO research ledger

| File | Purpose | Rows | API cost |
| --- | --- | ---: | ---: |
| `sacramento-keyword-discovery.json` | Keyword discovery from a broad Sacramento seed | 6 | $0.01272 |
| `sacramento-keyword-ideas.json` | Expanded keyword ideas | 1,000 | $0.132 |
| `validated-local-keyword-volume.json` | Validation of selected Sacramento/Placer long tails | 11 | $0.09 |
| `city-serps-water-heater-replacement.json` | Localized SERPs for seven Sacramento/Placer cities | 7 | $0.028 |
| `california-city-demand.json` | Expanded California city keyword demand | 362 | $0.09 |
| `market-cluster-demand.json` | Four-cluster totals for 17 selected markets | 272 | $0.09 |

Recorded DataForSEO API spend for these saved datasets: **$0.44272**.

## 12. Source files and reproducibility

Raw datasets:

- `research/dataforseo/2026-08-03/sacramento-keyword-discovery.json`
- `research/dataforseo/2026-08-03/sacramento-keyword-ideas.json`
- `research/dataforseo/2026-08-03/validated-local-keyword-volume.json`
- `research/dataforseo/2026-08-03/city-serps-water-heater-replacement.json`
- `research/dataforseo/2026-08-03/california-city-demand.json`
- `research/dataforseo/2026-08-03/market-cluster-demand.json`

Research scripts:

- `scripts/discover-sacramento-keywords.mjs`
- `scripts/discover-sacramento-keyword-ideas.mjs`
- `scripts/validate-local-keyword-volume.mjs`
- `scripts/research-city-serps.mjs`
- `scripts/research-california-city-demand.mjs`
- `scripts/research-market-cluster-demand.mjs`
- `scripts/research-local-keywords.mjs`

Credentials are read only from `.env`, which is ignored by Git. Never commit API credentials or generated authorization headers.

## 13. Decisions still requiring real business information

- Exact service boundary and whether every proposed California market is genuinely served.
- Valid business address or confirmation that the company is service-area-only.
- Google Business Profile status and primary category.
- Verified licensing details, warranties, company history, reviews, and operating hours.
- Whether leads should go to SMS only or to a backend/CRM.

Until supplied, these items must remain absent rather than filled with placeholder or invented claims.
