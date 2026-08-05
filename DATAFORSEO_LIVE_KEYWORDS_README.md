# DataForSEO local search-volume input

Prepared: 2026-08-05

Use `DATAFORSEO_LIVE_KEYWORDS.csv` as the approved input list for Google Ads Search Volume validation with a city supplied through the API `location_name` field.

For reporting after the 2026-08-05 intent correction, use `DATAFORSEO_LIVE_KEYWORDS_STRICT.csv`. It requires every water-heater keyword to express replacement or installation explicitly and excludes generic product-price/service queries.

## Current scope

- Water-heater replacement and installation only. Repair terms, brands, tank capacities, lifespan, and other informational/product intents are excluded.
- Residential interior painting.
- Residential exterior painting.
- Wallpaper installation and hanging. Generic wallpaper shopping/background terms and wallpaper removal are excluded.
- Floristry contains the user-provided vocabulary with `Sacramento` removed and duplicates collapsed.

Do not append a city name to these keywords for this test. The purpose is to measure searches made by people targeted to the city, for example:

```json
{
  "location_name": "San Diego,California,United States",
  "keywords": ["exterior house painting"]
}
```

Keep city-modified queries such as `exterior house painting san diego` in a separate dataset. They answer a different question and must not be added to the geographically targeted total without deduplication.

## Cost rule

No paid API call is authorized merely by editing this file. Before every DataForSEO execution, state its expected cost to the user.

Google Ads Search Volume Live currently costs $0.09 per task with up to 1,000 keywords. Each city/location is a separate task. Confirm current pricing immediately before execution.

The combined file must remain at or below 1,000 non-empty keywords.
