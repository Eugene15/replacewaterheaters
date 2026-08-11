import json
import sys
from pathlib import Path

REQUIRED_FILES = ["project-context.json", "canonical-facts.json", "learning-memory.json"]
REQUIRED_PIPELINE_ROLES = {
    "marketing_conversion", "geo_naturalness_reviewer",
    "editorial_marketing_reviewer", "ui_visual_designer", "visual_design_critic",
    "competitor_function_analyst", "evidence_inventory", "visitor_state",
    "section_utility_critic", "reasoning_router"
}
REQUIRED_PIPELINE_STAGES = {
    "marketing_brief", "seo_schema_review", "geo_naturalness_review",
    "editorial_marketing_review", "ui_visual_design", "render_capture",
    "visual_design_critique", "competitor_function_analysis",
    "evidence_inventory", "visitor_state", "section_utility_review",
    "reasoning_plan", "prewriting_checkpoint"
}


def load(path: Path):
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def main() -> int:
    if len(sys.argv) != 2:
        print("Usage: validate_project.py <project-config-directory>")
        return 2
    root = Path(sys.argv[1]).resolve()
    errors = []
    kit_root = Path(__file__).resolve().parent.parent
    try:
        registry = load(kit_root / "assets" / "pipeline" / "agent-registry.json")
        graph = load(kit_root / "assets" / "pipeline" / "stage-graph.json")
        role_keys = [agent.get("key") for agent in registry.get("agents", [])]
        stage_keys = [stage.get("key") for stage in graph.get("stages", [])]
        if len(role_keys) != len(set(role_keys)):
            errors.append("agent-registry.json contains duplicate role keys")
        if len(stage_keys) != len(set(stage_keys)):
            errors.append("stage-graph.json contains duplicate stage keys")
        missing_roles = sorted(REQUIRED_PIPELINE_ROLES - set(role_keys))
        missing_stages = sorted(REQUIRED_PIPELINE_STAGES - set(stage_keys))
        if missing_roles:
            errors.append(f"Required pipeline roles missing: {', '.join(missing_roles)}")
        if missing_stages:
            errors.append(f"Required pipeline stages missing: {', '.join(missing_stages)}")
        positions = {key: index for index, key in enumerate(stage_keys)}
        for stage in graph.get("stages", []):
            for dependency in stage.get("dependsOn", []):
                if dependency not in positions:
                    errors.append(f"Stage {stage.get('key')} has unknown dependency {dependency}")
                elif positions[dependency] >= positions[stage.get("key")]:
                    errors.append(f"Stage {stage.get('key')} depends on non-earlier stage {dependency}")
        required_order = ["seo_schema_review", "geo_naturalness_review", "editorial_marketing_review", "ui_visual_design", "render_capture", "visual_design_critique"]
        if all(key in positions for key in required_order) and [positions[key] for key in required_order] != sorted(positions[key] for key in required_order):
            errors.append("Required SEO -> GEO -> editorial -> UI -> render -> visual critique order is broken")
        utility_order = ["serp_evidence", "competitor_function_analysis", "evidence_inventory", "visitor_state", "reasoning_plan", "page_strategy", "page_architecture", "prewriting_checkpoint", "page_copy", "section_utility_review", "seo_schema_review"]
        if all(key in positions for key in utility_order) and [positions[key] for key in utility_order] != sorted(positions[key] for key in utility_order):
            errors.append("Required evidence -> visitor state -> architecture -> copy -> utility critic -> SEO order is broken")
        seo_stage = next((s for s in graph.get("stages", []) if s.get("key") == "seo_schema_review"), {})
        if "section_utility_review" not in seo_stage.get("dependsOn", []):
            errors.append("seo_schema_review must depend on section_utility_review")
        component_stage = next((s for s in graph.get("stages", []) if s.get("key") == "component_mapping"), {})
        if "prewriting_checkpoint" not in component_stage.get("dependsOn", []):
            errors.append("component_mapping must depend on prewriting_checkpoint")
        portfolio = next((s for s in graph.get("stages", []) if s.get("key") == "page_portfolio"), {})
        if not {"keyword_intent", "serp_evidence"}.issubset(set(portfolio.get("dependsOn", []))):
            errors.append("page_portfolio must depend on keyword_intent and serp_evidence")
    except Exception as exc:
        errors.append(f"Invalid pipeline configuration: {exc}")
    for name in REQUIRED_FILES:
        path = root / name
        if not path.exists():
            errors.append(f"Missing {name}")
            continue
        try:
            data = load(path)
        except Exception as exc:
            errors.append(f"Invalid JSON in {name}: {exc}")
            continue
        serialized = json.dumps(data, ensure_ascii=False)
        if "ADAPT_REQUIRED" in serialized or "REPLACE_WITH_" in serialized:
            errors.append(f"Unadapted placeholders remain in {name}")

    if not errors:
        context = load(root / "project-context.json")
        facts = load(root / "canonical-facts.json")
        memory = load(root / "learning-memory.json")
        if not context.get("buyerJobs") or not context.get("queryFamilies"):
            errors.append("project-context.json needs buyerJobs and queryFamilies")
        geo_policy = context.get("geoNaturalnessPolicy", {})
        if geo_policy.get("cityMentionRule") != "semantic_necessity_only":
            errors.append("project-context.json must require semantic_necessity_only city mentions")
        if geo_policy.get("forbidFrequencyTargets") is not True:
            errors.append("project-context.json must forbid city-frequency targets")
        if geo_policy.get("unresolvedSeoDrivenAllowed") != 0:
            errors.append("project-context.json must allow zero unresolved SEO-driven occurrences")
        if not facts.get("facts"):
            errors.append("canonical-facts.json needs at least one verified fact")
        if memory.get("schemaVersion") != "agent-learning-memory.v1":
            errors.append("learning-memory.json has an unsupported schemaVersion")

    if errors:
        print("Project adaptation is NOT ready:")
        for error in errors:
            print(f"- {error}")
        return 1
    print("Project adaptation is ready for a local pilot.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
