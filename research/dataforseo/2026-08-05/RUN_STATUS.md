# All-services keyword research run status

Updated: 2026-08-05

## Completed

- DataForSEO Labs Keyword Ideas: five groups, 1,000 ideas per group.
- Actual Keyword Ideas cost: **$0.66**.
- Filtered review list: **403** unique, city-free keywords.
- Saved Google Ads geo-volume responses for Santa Monica, Chula Vista, Carlsbad, and Thousand Oaks.

## Geo-volume interruption

The initial Google Ads Search Volume Live process reached the account limit of 12 calls per minute while starting Chula Vista. Fourteen preceding city calls had succeeded, but the script terminated before persisting its in-memory responses. Those Live results cannot be recovered through Task GET.

A second checkpointed run saved the last four markets. It unnecessarily repeated Santa Monica because the initial success count was first undercounted by one.

- Initial successful Live calls: 14 × $0.09 = **$1.26**.
- Checkpointed Live calls: 4 × $0.09 = **$0.36**.
- Actual geo-volume spend so far: **$1.62**.
- Total spend for this run, including Keyword Ideas: **$2.28**.

The saved four-market file is `all-services-geo-volume-from-13.json`. Complete results for the first 13 unique markets remain unavailable.

## Completion

The user authorized the recovery run. The first 13 markets were completed through Google Ads Search Volume Standard Queue:

- 13 tasks × $0.06 = **$0.78 additional cost**.
- All 13 task results were collected successfully.
- The results were merged with Santa Monica, Chula Vista, Carlsbad, and Thousand Oaks from the checkpointed Live run.
- Final coverage: **403 keywords × 17 markets = 6,851 measurements**.
- Final combined files:
  - `all-services-17-market-geo-volume-complete.json`
  - `all-services-17-market-keyword-volume.csv`
  - `all-services-17-market-volume-matrix.csv`
  - `all-services-17-market-summary.csv`

Total DataForSEO spend for this workflow:

- Keyword Ideas: **$0.66**.
- Original and checkpointed Live geo calls: **$1.62**.
- Standard Queue recovery: **$0.78**.
- **Grand total: $3.06**.

## Water-heater intent correction

The first merged list contained 14 ambiguous water-heater queries with possible product-shopping intent, such as generic equipment cost/price and `water heater service`. They are retained only in the raw research for auditability and must not be used in replacement-service demand totals.

The canonical strict outputs are:

- `DATAFORSEO_LIVE_KEYWORDS_STRICT.csv`
- `all-services-17-market-geo-volume-strict.json`
- `all-services-17-market-volume-matrix-strict.csv`
- `all-services-17-market-summary-strict.csv`
- `water-heater-excluded-nonreplacement-keywords.csv`

Strict scope results:

- 116 water-heater keywords, all with explicit replacement/installation/changeout/swap/conversion intent.
- 14 ambiguous water-heater keywords excluded.
- 0 repair, maintenance, or parts keywords.
- No additional DataForSEO cost; strict reports were rebuilt from the saved 17-market responses.
