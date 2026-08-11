# Page team architecture

Use this responsibility chain for buyer-facing SEO pages:

`SERP evidence -> competitor functions -> evidence inventory -> visitor state -> page strategy -> architecture -> marketing brief -> copy -> section utility critic -> SEO controlled edits -> GEO naturalness -> editorial review -> UI design -> render -> visual critique -> buyer review -> release gate`

Roles may share an executor only in separate calls with separate artifacts. Never merge decisions into one unreviewable response.

## Ownership

- SERP Researcher owns evidence and competitor patterns, not final copy.
- Competitor Function Analyst owns the mapping from competitor elements to buyer concerns and functions, never the page outline.
- Evidence Inventory owns the explicit boundary between verified, conditional, unavailable and desired capabilities.
- Visitor State Analyst owns triggers, uncertainties, anxieties, decisions and action barriers before strategy.
- Page Strategist owns audience moment, page promise, narrative and section purpose.
- Marketing/Conversion owns value, motivation, objections, proof needs and CTA logic, not prose polishing.
- Copywriter owns wording inside the passed strategy and brief. Raise a strategy issue instead of silently changing business logic.
- Section Utility Critic owns per-section classification before SEO and cannot rewrite or approve its own copy.
- SEO owns controlled optimization, not positioning, page strategy or wholesale rewriting.
- GEO Naturalness Reviewer owns classification of geographic mentions, not keyword targets.
- Editorial/Marketing Reviewer owns the post-SEO whole-page gate and routes findings to the responsible owner instead of rewriting everything.
- Component Mapper owns content-format constraints, not final visual design.
- UI/Visual Designer owns hierarchy, composition, rhythm and responsive implementation. Never delete required content merely because it does not fit.
- Visual Design Critic owns adversarial screenshot critique and never edits code.
- Human Buyer Reviewer owns blind comprehension, trust, friction and next-action review.
- Quality Gate aggregates exact-hash artifacts and cannot reinterpret a failure.

Out-of-scope findings become structured issues addressed to their owner.

## Shared page model

Every page run must maintain one shared model:

```json
{
  "searchIntent": {},
  "audience": {},
  "primaryGoal": "string",
  "valueProposition": {"statement":"string","factIds":[]},
  "sections": [{
    "blockId":"string",
    "purpose":"string",
    "userQuestion":"string",
    "usefulInformation":"string",
    "reasonToExist":"string",
    "contribution":"understand|decide|trust|act",
    "removalLoss":"string",
    "keyMessage":"string",
    "marketingPriority":"primary|supporting|utility",
    "seoIntent":"string",
    "content":{},
    "presentationHint":"string",
    "cta":{},
    "evidenceIds":[]
  }],
  "seo": {},
  "internalLinks": [],
  "evidence": []
}
```

Agents update only fields they own. The next role receives passed artifacts and evidence, not the full transcript or hidden reasoning.

## Return loops

- weak evidence -> SERP Evidence;
- unclear buyer sequence -> Page Strategy or Content Architecture;
- weak value, proof or CTA motivation -> Marketing/Conversion;
- unnatural or generic wording -> Copywriter;
- SEO gap that corresponds to a real buyer question -> Page Architecture, then copy and all downstream reviews;
- SEO-only insertion or unnatural city repetition -> SEO or GEO Naturalness;
- broken whole-page narrative after SEO -> responsible strategy, marketing, copy or SEO owner;
- wrong content format -> Component Mapper;
- weak composition -> UI Designer;
- screenshot issue -> Visual Design Critic routes to UI Designer;
- unsupported rendered claim -> Business Fact Gate and responsible copy owner.

Any upstream correction invalidates affected downstream artifacts and hashes.

## Gates, not scores

Do not use self-awarded numerical scores. A stage passes only when its explicit checks pass and no unresolved `critical`, `major` or `blocker` finding remains.

Before UI design, the post-SEO editorial gate must confirm: coherent narrative; clear offer; supported value; useful differentiation; motivated CTA; natural language; no duplicate sections; no unsupported claims; intent satisfaction; proportionate pacing.

Before release, the visual gate must confirm: clear focus; intentional whitespace; consistent rhythm; readable measures; distinct section boundaries; no competing primary actions; responsive screenshots reviewed; demanding-user acceptance passed.

## Visual direction

Before a new page family is designed, create a short `visual-direction-brief.json` from strong references for the same page type. Analyze principles, not a page to copy: hero composition, type scale, spacing rhythm, density, media ratio, navigation, CTA treatment, transitions and mobile behavior.
