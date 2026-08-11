# Adaptive model and reasoning routing

Allocate reasoning where it can change what should be written and why. Do not spend the strongest configuration on mechanical prose or deterministic validation.

## Routing owner

The orchestrator produces `reasoning-plan.json` after competitor functions, evidence inventory and visitor state are known. Individual roles cannot silently lower their assigned effort or self-escalate cost. Record model, effort, reason, complexity signals and escalation conditions for every generative/review stage.

## Default stage policy

- Evidence collection and extraction: `gpt-5.6-terra`, `medium`; use `gpt-5.6-sol`, `medium` when sources conflict or interpretation is unusually difficult.
- Visitor state and buyer journey: `gpt-5.6-sol`, `high`.
- Strategy and architecture: `gpt-5.6-sol`, `high`; escalate to `xhigh` for very-high complexity.
- Bounded copy execution: `gpt-5.6-terra`, `medium` or `gpt-5.6-sol`, `low` when exact project voice benefits from Sol.
- Section utility, architecture, editorial and buyer critics: `gpt-5.6-sol`, `high`; escalate to `xhigh` when the page lacks a credible trust or utility strategy.
- Mechanical schema, hash, HTML and deterministic validators: no generative model.

These are routing defaults, not a promise that every runtime exposes the same labels. An adapter may map them to equivalent supported settings but must preserve the intended relative effort and record the mapping.

## Complexity levels

- `low`: approved strategy and pattern, bounded copy execution, no new claims or local ambiguity.
- `medium`: new city with meaningful local research but established service strategy.
- `high`: weak company proof, strong competitors, meaningful positioning, new local constraints, or architecture decisions.
- `very_high`: no credible advantage, utility depends on missing capabilities, evidence conflicts, or the proposed page relies on filler/reputation imitation.

Do not compensate for high uncertainty with more prose. Escalate strategy/architecture reasoning first.

## Stop-before-writing checkpoint

After strategy and architecture review, produce `prewriting-checkpoint.json` answering:

1. Why does this page deserve to exist?
2. What does the visitor actually need?
3. What realistic competitive advantage does the page have?
4. What can the company not honestly claim?
5. What functions do established competitors use to create trust?
6. What verified alternative trust mechanisms can this page provide?
7. What useful information or real functionality may competitors be missing?
8. Is the strategy strong enough to justify writing?

Allowed decisions: `proceed`, `escalate_reasoning`, `return_to_research`, `return_to_strategy`, or `return_to_architecture`. Only `proceed` allows component mapping, copy brief and writing.

## Cost and integrity

Record planned and actual model/effort per stage. A cheaper writer cannot override the passed strategy. A stronger critic cannot silently rewrite; it returns findings to the responsible owner. Quality gates reject missing routing evidence, unrecorded downgrades and copy produced before a passing checkpoint.
