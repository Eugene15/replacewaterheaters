# Quality gates

## Deterministic gates

Check required artifacts, schema validity, source lineage, unique H1, metadata, canonical, robots, structured-data consistency, internal-link destinations, unsupported claims, content hashes, stale reviews, viewport overflow, image dimensions, aspect ratios, low-resolution upscaling, cropped focal subjects, empty columns, minimum spacing, component existence, FAQ behavior and release approval.

## Semantic gates

Require competitor-function analysis, explicit evidence inventory, visitor-state analysis, pre-SEO section utility review, independent post-SEO editorial/marketing, GEO-naturalness and cross-page reviews. Block copied competitor trust architecture, reputation language without proof, repeated ideas, artificial keyword paragraphs, empty slogans, internal implementation language, isolated technical details, unrelated CTA copy, repeated page recipes and FAQ/title duplication. Every section must be classified and zero `GENERIC_FILLER`, `SEO_ONLY` or `UNSUPPORTED_CLAIM` classifications may remain. Every geographic occurrence must be classified; zero `seo-driven` occurrences may remain. City-frequency, density and every-section rules are prohibited.

## Marketing gate

Require a supported reason to care, value proposition, benefit-to-proof mapping, objection handling and CTA motivation. Marketing may omit a section when evidence or buyer need does not justify it. Unsupported differentiation, invented benefits and filler added for length are blockers.

## Visual gates

UI design starts only after copy, SEO, GEO naturalness and editorial/marketing gates pass. Review 4K desktop first during content acceptance. After approval, review Full HD, tablet and mobile. Require literal frame observations. Check hierarchy, balance, subject crop, whitespace, media quality, text density, background layering, corners, shadows, CTA context, footer separation and family-level diversity. The independent Visual Design Critic must not be the designer and must return ranked findings rather than edit. Green geometry tests never justify a visibly poor result.

## Performance gates

Measure lab performance separately from field Core Web Vitals. Do not promise a score of 100. Track LCP, INP/TBT, CLS, image bytes, render-blocking resources and analytics cost. Optimize without removing required measurement or accessibility.

## Release gate

Publish only when:

- every required stage artifact exists;
- every validator passed;
- zero blocker findings remain;
- reviews match the current content hash;
- owner approval matches run ID and hash;
- build and prerender pass;
- rollback version is stored.

PASS additionally requires zero unresolved critical or major findings. Numeric self-scores cannot substitute for an explicit gate result.
