// Scans our own page/component/seed source files for marketing copy that
// CLAUDE.md rule 8 bans: income guarantees, fake scarcity, fake social proof.
// This is a lint over our own copy, not over arbitrary third-party text.
import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const bannedPatterns: { label: string; pattern: RegExp }[] = [
  { label: "income guarantee", pattern: /guarantee[ds]?\s+income/i },
  { label: "guaranteed earnings amount", pattern: /earn\s+[\d,]+\s*(lakh|crore|lakhs|crores)[^.]*guarantee/i },
  { label: "guaranteed returns", pattern: /guaranteed\s+returns?/i },
  { label: "fake countdown/scarcity", pattern: /only\s+\d+\s+(left|spots?|seats?)\s+(left|remaining)?/i },
  { label: "fake live viewer/buyer counter", pattern: /\d+\s+people\s+(bought|are\s+viewing|viewing)\s+this/i },
];

const scanDirs = [join(process.cwd(), "src", "app"), join(process.cwd(), "src", "components")];
const scanFiles = [join(process.cwd(), "scripts", "seed.ts")];

function collectSourceFiles(dir: string): string[] {
  const entries = readdirSync(dir);
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      files.push(...collectSourceFiles(fullPath));
    } else if (/\.(tsx?|jsx?)$/.test(entry)) {
      files.push(fullPath);
    }
  }
  return files;
}

describe("marketing copy guard", () => {
  const files = [...scanDirs.flatMap(collectSourceFiles), ...scanFiles];

  it("found at least one file to scan", () => {
    expect(files.length).toBeGreaterThan(0);
  });

  for (const file of files) {
    it(`${file.replace(process.cwd(), "")} has no banned income-claim or fake-scarcity copy`, () => {
      const content = readFileSync(file, "utf-8");
      for (const { label, pattern } of bannedPatterns) {
        expect(pattern.test(content), `${file} matched banned pattern: ${label}`).toBe(false);
      }
    });
  }
});
