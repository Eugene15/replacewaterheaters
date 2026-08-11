# Pipeline and agent responsibilities

## Stage graph

1. Research Brief defines market, audience, scope, conversion and budget.
2. Keyword & Intent decides search intent and candidate topics.
3. SERP Evidence stores localized results, result types, patterns and gaps.
4. Competitor Function Analysis maps competitor proof and sections to buyer concerns and functional jobs without copying their architecture.
5. Page Portfolio Gate merges or separates candidate pages using localized evidence.
6. Business Fact Gate produces verified and prohibited claims.
7. Evidence Inventory separates verified, conditional, unavailable and desired capabilities.
8. Visitor State orders triggers, knowledge gaps, anxieties, decisions and action barriers.
9. Buyer Journey orders jobs, questions, anxieties and decision criteria.
10. Page Strategist defines promise, differentiation, conversion and narrative thesis.
11. Content Architect creates ordered utility-bearing semantic blocks and transitions.
9. Architecture Reviewer challenges necessity, truth, order and differentiation.
10. Marketing & Conversion creates value, proof, objection and CTA requirements.
11. Component Mapper assigns content-format constraints, not final visual design.
12. Copy Brief turns every block into a bounded writing assignment.
13. Grounded Writer creates human-first metadata, copy, FAQ and link text.
14. Section Utility Critic classifies every section and blocks filler, SEO-only content and unsupported claims.
15. SEO & Schema Reviewer proposes controlled edits and checks intent, metadata, linking, indexability and structured data.
15. GEO Naturalness Reviewer classifies every geographic occurrence and removes SEO-driven repetition.
16. Editorial & Marketing Reviewer checks the post-SEO page as one buyer story and routes issues to their owners.
17. UI & Visual Designer implements the passed meaning, priority and copy without deleting required content.
18. Renderer captures the real implementation and performance evidence.
19. Visual Design Critic performs adversarial screenshot review and returns ranked issues to the designer.
20. Human Buyer Reviewer evaluates comprehension, trust, friction and next action from a blind rendered context.
21. Visual Diversity Curator checks page-family repetition independently.
22. Capability & Fact Check revalidates the final rendered copy.
23. Quality Gate aggregates only current evidence and routes failures.
24. Owner Approval approves one immutable run and content hash.
25. Publisher publishes only the approved version.
26. Monitoring collects GSC, analytics, conversions, performance and index state.
27. GEO Observer records actual answer-engine responses and citations.
28. Opportunity Planner proposes evidence-backed improvements.
29. Memory Curator records confirmed learning for future runs.

These are responsibilities, not necessarily separate models. A single executor may perform multiple roles in separate calls, but may not combine their decisions into an unreviewable response.

## Failure routing

- weak evidence -> Research, SERP Evidence or Evidence Inventory;
- copied competitor architecture -> Competitor Function Analysis;
- missing visitor uncertainty or action barrier -> Visitor State;
- unsupported capability -> Business Fact Gate;
- missing buyer need -> Buyer Journey or Architecture;
- unnecessary/repeated block -> Architecture;
- weak value, proof, objection handling or CTA logic -> Marketing & Conversion;
- wrong content format constraint -> Component Mapper;
- wording defect introduced by the Writer -> Grounded Writer;
- filler, SEO-only or unsupported section -> exact strategy, architecture, marketing or writer owner named by Section Utility Critic;
- SEO-driven geographic repetition -> SEO & Schema Reviewer, then GEO Naturalness Reviewer reruns;
- post-SEO narrative or conversion regression -> the exact owner named by Editorial & Marketing Reviewer;
- cross-page sameness -> Strategy or Architecture;
- SEO omission that represents a real buyer question -> Architecture;
- metadata/schema-only issue -> SEO Reviewer;
- implemented hierarchy, composition, spacing or responsive issue -> UI & Visual Designer;
- screenshot design defect -> Visual Design Critic returns it to UI & Visual Designer and reviews a new render;
- stale review -> rerun affected review;
- unresolved blocker after two cycles -> owner input;
- failed Quality Gate -> never publish.

## Page portfolio heuristic

- 60% or greater localized top-10 overlap plus the same buyer job usually means merge.
- 35% or lower overlap plus different job, questions, answer depth and conversion may justify separate pages.
- Between thresholds requires owner review.
- Missing localized evidence blocks the decision.

Treat these thresholds as workflow heuristics, not search-engine rules. Recalibrate with Search Console cannibalization data.

The shared page model, ownership boundaries and return loops are defined in `page-team-architecture.md`. Geographic wording is governed by `geo-naturalness.md`.
