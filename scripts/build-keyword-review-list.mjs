import fs from "node:fs/promises";
import path from "node:path";

const masterPath = path.resolve("DATAFORSEO_LIVE_KEYWORDS.csv");
const candidatesPath = path.resolve("research", "dataforseo", "2026-08-05", "all-services-filtered-candidates.csv");
const outputPath = path.resolve("DATAFORSEO_LIVE_KEYWORDS_REVIEW.csv");

const masterLines = (await fs.readFile(masterPath, "utf8")).trim().split(/\r?\n/);
const candidateLines = (await fs.readFile(candidatesPath, "utf8")).trim().split(/\r?\n/).slice(1);
const existing = new Set(masterLines.slice(1).map((line) => line.split(",").slice(2).join(",").trim().toLowerCase()));
const additions = [];

for (const line of candidateLines) {
  // Candidate fields do not contain commas after filtering.
  const [category, cluster, keyword] = line.split(",");
  if (!keyword || existing.has(keyword.toLowerCase())) continue;
  existing.add(keyword.toLowerCase());
  additions.push(`${category},${cluster},${keyword}`);
}

await fs.writeFile(outputPath, `${[...masterLines, ...additions].join("\n")}\n`);
console.log(JSON.stringify({ outputPath, original: masterLines.length - 1, added: additions.length, total: masterLines.length - 1 + additions.length }, null, 2));
