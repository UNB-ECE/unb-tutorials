#!/usr/bin/env node
// Checks the validator against its fixtures.
//
// Every directory under test/fixtures is a miniature repository. Its expect.json
// says whether validateRepo() should accept it, and for a rejected fixture which
// problem it must report — so a fixture that starts failing for the wrong reason
// does not quietly pass.

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { validateRepo } from "./validate.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const fixturesDir = resolve(here, "..", "test", "fixtures");

if (!existsSync(fixturesDir)) {
    console.error(`Fixtures folder is missing: ${fixturesDir}`);
    process.exit(1);
}

let failures = 0;

for (const name of readdirSync(fixturesDir).sort()) {
    const fixtureDir = join(fixturesDir, name);
    if (!statSync(fixtureDir).isDirectory()) continue;

    const expectPath = join(fixtureDir, "expect.json");
    if (!existsSync(expectPath)) {
        console.error(`✗ ${name}: expect.json is missing`);
        failures++;
        continue;
    }

    const expectation = JSON.parse(readFileSync(expectPath, "utf8"));
    const problems = validateRepo(fixtureDir);
    const accepted = problems.length === 0;

    if (expectation.valid !== accepted) {
        failures++;
        console.error(`✗ ${name}: expected ${expectation.valid ? "acceptance" : "rejection"}, got ${accepted ? "acceptance" : "rejection"}`);
        for (const problem of problems) console.error(`      ${problem}`);
        continue;
    }

    if (accepted) {
        console.log(`✓ ${name}: accepted`);
        continue;
    }

    const expected = expectation.contains;
    if (typeof expected === "string" && !problems.some((p) => p.includes(expected))) {
        failures++;
        console.error(`✗ ${name}: rejected, but no problem mentioned "${expected}"`);
        for (const problem of problems) console.error(`      ${problem}`);
        continue;
    }

    console.log(`✓ ${name}: rejected for the expected reason`);
}

if (failures) {
    console.error(`\n${failures} fixture(s) behaved unexpectedly.`);
    process.exit(1);
}

console.log("\nAll fixtures behaved as expected.");
