# GEO naturalness

Optimize local relevance at page level, not by repeating a city in every section.

## Semantic necessity test

For every city, county, neighborhood and derived geographic phrase, ask:

1. Would the sentence lose useful information if the geographic phrase were removed?
2. Would a normal writer who was not thinking about SEO naturally use it here?
3. After removal, is the sentence equally clear or more natural?

If geography adds no meaning, remove it.

## Inherited page context

After URL, title, H1, introduction, service-area language, local entities and verified local evidence establish geography, ordinary advice and product/service explanations inherit that context. The reader does not need the city restated in every block.

Geography is normally meaningful for coverage, service availability, neighborhoods, local timing, jurisdiction, verified local requirements, local evidence and headings required by search intent. It is normally unnecessary in generic advice, product descriptions, recipient or occasion copy, instructions, CTA labels, emotional copy, generic FAQ and explanations that do not change by city.

Do not hide repetition behind variants such as `local`, `area`, `nearby`, `based in`, `across`, `here in`, reversed word order or partial-match phrases.

## Required artifact

After SEO controlled edits and before the final editorial review, produce `geo-naturalness-review.json` containing every geographic occurrence in visible text and metadata:

```json
{
  "route":"string",
  "releaseHash":"sha256",
  "pageGeoContextEstablished":true,
  "occurrences":[{
    "occurrenceId":"string",
    "location":"selector, metadata field or quote",
    "phrase":"string",
    "quote":"string",
    "classification":"required|natural|seo-driven",
    "semanticLossIfRemoved":"string",
    "naturalWriterWouldUse":true,
    "action":"keep|remove|rewrite",
    "replacement":"string"
  }],
  "adjacentRepetitionFindings":[],
  "unresolvedSeoDrivenCount":0,
  "status":"complete|blocked"
}
```

Every `seo-driven` occurrence must be removed or rewritten. Repeated city mentions in adjacent sentences or nearby blocks require explicit geographic justification. The gate fails if any occurrence is unclassified or unresolved.

No city-frequency threshold, every-section requirement, every-N-words rule or keyword-density target is permitted. More exact or partial GEO matches are not automatically an improvement.

Final test: a normal visitor must never wonder why the page repeated the city again. If the SEO technique is noticeable during ordinary reading, the page fails.
