# San Diego broad-query SERP intent analysis

Date: 2026-08-05  
Provider: DataForSEO Google Organic Live Advanced  
Location: San Diego, California, United States  
Device: mobile / Android  
Depth: top 20  
Queries: 8  
Actual cost: **$0.032**

## Decision summary

| Query | Primary intent in San Diego | Local Pack | SEO demand treatment |
| --- | --- | ---: | --- |
| `flowers` | Local-commercial / florist discovery, with a small mixed component | 3 results | Keep as a broad florist-hub keyword, but do not call the full volume bouquet orders |
| `water heater` | Product shopping / buying research | 2 results | Exclude from replacement demand |
| `water heaters` | Product shopping / buying research | 3 results | Exclude from replacement demand |
| `hot water heater` | Product shopping / buying research | 3 results | Exclude from replacement demand |
| `tankless water heater` | Product + informational research | 3 results | Exclude from replacement demand |
| `gas water heater` | Product shopping | 2 results | Exclude from replacement demand |
| `electric water heater` | Product shopping | 2 results | Exclude from replacement demand |
| `heat pump water heater` | Informational + product/rebate research | 0 results | Exclude from replacement demand |

## `flowers`

The query has strong local-commercial intent in San Diego:

- Google displayed a 3-result Local Pack.
- Nine of the first twelve organic results were florist, flower-shop, flower-delivery, or florist-directory pages.
- Leading results included 1-800-Flowers, Allen's Flowers, Four Seasons Flowers, Native Poppy, SD Flower Shop, Dave's Flower Box, Little House of Flowers, Liz's Flowers, and Eden Flowers & Gifts.
- Mixed results were still present, including a music video and an informational page about flower types.

Conclusion: `flowers` is a valid broad local-discovery keyword for a florist homepage or city florist hub. However, its entire search volume is not equivalent to completed bouquet orders or even explicit delivery intent. Keep it separate from strict transaction terms such as `flower delivery`, `same day flower delivery`, and `order flowers`.

In the saved San Diego Google Ads volume data, `flowers` has **12,100 searches/month**. Report this as broad local florist discovery, not as 12,100 bouquet-order searches.

## Broad water-heater queries

The organic top results consistently favored retailers, manufacturers, product catalogs, buying guides, and informational content:

- `water heater`: Home Depot, Lowe's, Consumer Reports, State Water Heaters, Amazon, Ace Hardware.
- `water heaters`: Home Depot, Consumer Reports, Lowe's, Menards, Ace Hardware, Amazon.
- `hot water heater`: Home Depot, Lowe's, Consumer Reports, Menards, Ace Hardware, Amazon, product manufacturers.
- `tankless water heater`: Home Depot, Eccotemp, Navien, ENERGY STAR, Consumer Reports, manufacturers and product catalogs.
- `gas water heater`: Home Depot, Lowe's, Ferguson, Ace Hardware, Grainger and manufacturers.
- `electric water heater`: Home Depot, Lowe's, manufacturers, Ferguson, Amazon, Menards and eBay.
- `heat pump water heater`: Home Depot, ENERGY STAR, Rheem, Consumer Reports, utility/rebate and explanatory content; no Local Pack was returned.

Some broad water-heater queries showed a Local Pack, proving that a minority local-service interpretation exists. It was not strong enough to classify these terms as replacement intent because product and research pages dominated the organic results.

Conclusion: do not include broad equipment terms in confirmed replacement demand. The strict water-heater dataset is correct to require explicit language such as `replacement`, `replace`, `installation`, `installer`, `changeout`, `swap`, or `conversion`.

## Cross-market inference

The primary intent is likely to remain broadly similar in other California markets because national retailers, manufacturers, and major florist platforms dominate these generic queries. Local Pack businesses and exact ranking domains will vary by city. Treat the San Diego result as an intent pilot, not proof that every city's SERP is identical.

Raw response: `san-diego-broad-intent-serps.json`.
