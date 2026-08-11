import json
import subprocess
import sys
import tempfile
from pathlib import Path


def write(path: Path, value):
    path.write_text(json.dumps(value), encoding="utf-8")


with tempfile.TemporaryDirectory() as temp:
    root = Path(temp)
    write(root / "project-context.json", {
        "projectId": "demo", "buyerJobs": ["buy"], "queryFamilies": ["service"],
        "geoNaturalnessPolicy": {
            "cityMentionRule": "semantic_necessity_only", "pageContextInherited": True,
            "forbidFrequencyTargets": True,
            "classifications": ["required", "natural", "seo-driven"],
            "unresolvedSeoDrivenAllowed": 0
        }
    })
    write(root / "canonical-facts.json", {"facts": [{"id": "fact-1"}]})
    write(root / "learning-memory.json", {
        "schemaVersion": "agent-learning-memory.v1", "entries": [],
        "feedbackLedger": [], "approvedExamples": [], "regressionRules": [], "candidates": []
    })
    script = Path(__file__).with_name("validate_project.py")
    result = subprocess.run([sys.executable, str(script), str(root)], capture_output=True, text=True)
    if result.returncode != 0:
        raise SystemExit(result.stdout + result.stderr)
    invalid = json.loads((root / "project-context.json").read_text(encoding="utf-8"))
    invalid["geoNaturalnessPolicy"]["unresolvedSeoDrivenAllowed"] = 1
    write(root / "project-context.json", invalid)
    failed = subprocess.run([sys.executable, str(script), str(root)], capture_output=True, text=True)
    if failed.returncode == 0:
        raise SystemExit("Validator accepted unresolved SEO-driven geographic occurrences")
    print(result.stdout.strip())
