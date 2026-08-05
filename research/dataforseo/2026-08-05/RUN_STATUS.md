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

## Cheapest completion path

Run the first 13 markets through Google Ads Search Volume Standard Queue:

- 13 tasks × $0.06 = **$0.78 additional cost**.

Do not execute this paid completion step without telling the user the cost and obtaining authorization.
