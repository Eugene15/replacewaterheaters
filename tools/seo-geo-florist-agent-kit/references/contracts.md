# Artifact contracts

Every artifact must include:

```json
{
  "schemaVersion": "role-artifact.v1",
  "projectId": "string",
  "runId": "string",
  "stage": "string",
  "createdAt": "ISO-8601",
  "producerId": "string",
  "inputHashes": ["sha256"],
  "contentHash": "sha256",
  "evidenceIds": ["string"],
  "status": "complete|blocked",
  "blockers": []
}
```

## Page architecture block

```json
{
  "blockId": "string",
  "order": 1,
  "role": "orient|explain|compare|prove|answer|convert",
  "buyerQuestion": "string",
  "usefulInformation": "string",
  "reasonToExist": "string",
  "contribution": "understand|decide|trust|act",
  "removalLoss": "string",
  "intendedUserAction": "string",
  "objectionOrRisk": "string",
  "keyMessage": "string",
  "desiredPerceptionShift": "string",
  "proofRequirement": "string",
  "evidenceIds": ["string"],
  "transitionFromPrevious": "string",
  "transitionToNext": "string",
  "presentationReason": "string",
  "component": {
    "componentKey": "string",
    "requiredSlots": ["string"],
    "headingMaxCharacters": 70,
    "bodyMaxWords": 120,
    "itemCount": {"min": 0, "max": 8},
    "media": "none|optional|required",
    "mobileRule": "string"
  },
  "requiredData": ["string"],
  "copyConstraints": ["string"],
  "allowedSeoEntities": ["string"],
  "prohibitedClaims": ["string"]
}
```

## Competitor function item

```json
{"element":"literal evidence","buyerConcern":"string","function":"string","proofType":"string","evidenceIds":["string"],"verifiedProjectResponse":"string|null","desiredCapability":"string|null","copyOrStructureRecommendation":"never_copy_directly"}
```

## Evidence inventory

```json
{"availableVerified":[{"item":"string","factIds":["string"]}],"conditional":[{"item":"string","condition":"string","factIds":["string"]}],"unavailableOrUnverified":["string"],"desiredCapabilities":["string"]}
```

## Visitor state

```json
{"triggerStates":["string"],"known":["string"],"unknowns":["string"],"anxieties":["string"],"decisions":["string"],"actionBarriers":["string"],"minimumUsefulNextStep":"string"}
```

## Reasoning plan

```json
{"complexity":"low|medium|high|very_high","signals":["string"],"stageAssignments":[{"stage":"string","model":"string|null","effort":"low|medium|high|xhigh|null","reason":"string","escalateWhen":["string"]}],"adapterMapping":{}}
```

## Prewriting checkpoint

```json
{"answers":[{"questionId":"1-8","answer":"string","evidenceIds":["string"]}],"decision":"proceed|escalate_reasoning|return_to_research|return_to_strategy|return_to_architecture","reason":"string","approvedStrategyHash":"sha256","approvedArchitectureHash":"sha256"}
```

Copy artifacts are invalid unless they reference a `proceed` checkpoint for the exact strategy and architecture hashes.

## Section utility review

```json
{"blockId":"string","classifications":["USER_VALUE|DECISION_SUPPORT|TRUST|LOCAL_VALUE|CONVERSION|VERIFIED_PROOF|GENERIC_FILLER|SEO_ONLY|UNSUPPORTED_CLAIM"],"concreteInformationLostIfRemoved":"string","cityMentionNecessary":true,"verdict":"pass|block","returnTo":"stage|null","requiredCorrection":"string|null"}
```

Every section must be classified. Zero `GENERIC_FILLER`, `SEO_ONLY`, and `UNSUPPORTED_CLAIM` classifications may remain before SEO.

## Shared page model

Every downstream role receives the same stable model: `searchIntent`, `audience`, `primaryGoal`, `valueProposition`, ordered `sections`, `cta`, `seo`, `internalLinks` and `evidence`. Each section carries `purpose`, `userQuestion`, `keyMessage`, `marketingPriority`, `seoIntent`, `content` and `presentationHint`. A role may update only fields it owns and must record a structured change or finding.

## Marketing brief item

```json
{"blockId":"string","buyerReasonToCare":"string","supportedBenefit":"string","proofEvidenceIds":["string"],"objection":"string","riskReduction":"string","ctaMotivation":"string"}
```

## Controlled SEO edit

```json
{"location":"string","before":"string","after":"string","seoReason":"string","buyerQuestion":"string","evidenceIds":["string"]}
```

## GEO occurrence review

```json
{"location":"string","occurrence":"string","classification":"required|natural|seo-driven","semanticNecessity":"string","action":"keep|remove|rewrite","resolvedText":"string"}
```

`geo-naturalness-review.json` must report `unclassifiedCount: 0` and `unresolvedSeoDrivenCount: 0`.

## Review finding

```json
{
  "findingId": "string",
  "artifactId": "string",
  "location": "block, selector, frame or quote",
  "quote": "literal evidence",
  "severity": "minor|major|critical|blocker",
  "category": "strategy|marketing|copy|geo|seo|fact|ui|visual|technical|diversity",
  "reason": "string",
  "returnTo": "stage",
  "requiredCorrection": "string"
}
```

Reviewers report issues; they do not silently modify another owner's fields. `critical` and `major` findings block the next stage until the responsible owner produces a new artifact and every dependent review is rerun.

## Owner approval

```json
{
  "runId": "string",
  "contentHash": "sha256",
  "qualityGateArtifactId": "string",
  "approvedBy": "owner identity",
  "approvedAt": "ISO-8601",
  "decision": "approve|reject",
  "notes": "string"
}
```

Publication must fail when hashes or run IDs differ.
