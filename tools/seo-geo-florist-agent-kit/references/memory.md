# Versioned learning memory

## Four layers

1. `feedbackLedger`: exact before/after, owner decision and rationale.
2. `entries`: generalized active or superseded patterns and anti-patterns.
3. `approvedExamples`: accepted text, components or screenshots used as references.
4. `regressionRules`: executable checks for measurable failures.

## Authority precedence

`latest owner decision > current brand rule > approved example > agent conclusion`

## Lifecycle

1. Store every correction in the ledger.
2. Add an agent inference as `candidate`, never active.
3. Promote only after owner or independent Quality Gate confirmation.
4. Assign a stable `knowledgeKey` and increment version.
5. Mark conflicting older entries `superseded`.
6. Build a task-specific memory packet by tags, component families and project.
7. Attach packet IDs to the generated artifact.
8. Run regression rules before Quality Gate.

## Do not transfer blindly

When adapting this kit, do not carry florist-specific owner decisions or examples into a different industry. Transfer universal workflow rules, then rebuild brand and domain memory from the target project.

