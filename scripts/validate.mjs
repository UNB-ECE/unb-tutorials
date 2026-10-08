#!/usr/bin/env node
// Content validator for the UNB IDE tutorial repository.
//
// The contract for a collection is:
//
//   <collection>/catalog.md          PXT gallery markdown: a "# Title" heading,
//                                    at least one "## Category" heading, and one
//                                    ```codecard fenced JSON array
//   <collection>/projects/<name>.md  one lesson per card
//   <collection>/static/<asset>      card and lesson images
//
// Card and image URLs are written as the absolute paths the editor requests, so
// they begin with the prefix declared in config.json. A URL that does not
// resolve to a file inside the same collection is a failure, which is what stops
// a card from pointing at a lesson that was never added.
//
// Usage: node scripts/validate.mjs [root]

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, resolve, relative, sep, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// Mirrors pxt's CodeCardType. Source of truth:
// software/pxt/localtypings/pxtpackage.d.ts in UNB-ECE/unb-platform.
export const CARD_TYPES = new Set([
    "file",
    "example",
    "codeExample",
    "tutorial",
    "side",
    "template",
    "package",
    "hw",
    "forumUrl",
    "forumExample",
    "sharedExample",
    "link",
]);

const REQUIRED_CARD_FIELDS = ["name", "url", "cardType"];
const CODECARD_BLOCK = /```codecard[^\n]*\n([\s\S]*?)\n[ \t]*```/;
const HEADING = /^#\s+\S/m;
// The editor's gallery parser only collects a ```codecard block once it has seen
// a "## Category" heading, so a catalog without one parses to no cards at all.
// A "# Title" is not a substitute: the level matters.
const CATEGORY_HEADING = /^##\s+\S/m;
const COLLECTION_ID = /^[a-z0-9][a-z0-9-]*$/;

/**
 * Validate every collection declared in <root>/config.json.
 * Returns a list of human-readable problems; empty means the content is valid.
 */
export function validateRepo(root) {
    const problems = [];
    const configPath = join(root, "config.json");

    if (!existsSync(configPath)) {
        return ["config.json is missing"];
    }

    let config;
    try {
        config = JSON.parse(readFileSync(configPath, "utf8"));
    } catch (e) {
        return [`config.json is not valid JSON: ${e.message}`];
    }

    const prefix = config.contentPathPrefix;
    if (typeof prefix !== "string" || !/^\/[A-Za-z0-9._~\-/]*[A-Za-z0-9._~\-]$/.test(prefix)) {
        problems.push('config.json: "contentPathPrefix" must be an absolute path such as "/unb-tutorials"');
    }

    const collections = config.collections;
    if (!Array.isArray(collections) || collections.length === 0) {
        problems.push('config.json: "collections" must be a non-empty array');
    } else {
        collections.forEach((collection, i) => {
            const where = `config.json: collections[${i}]`;
            if (!collection || typeof collection !== "object" || Array.isArray(collection)) {
                problems.push(`${where}: must be an object`);
                return;
            }
            if (typeof collection.id !== "string" || !COLLECTION_ID.test(collection.id)) {
                problems.push(`${where}: "id" must be a lowercase slug such as "unbdev-board"`);
            }
            if (typeof collection.title !== "string" || !collection.title.trim()) {
                problems.push(`${where}: "title" is required`);
            }
        });
    }

    if (problems.length) return problems;

    for (const collection of collections) {
        const collectionDir = join(root, collection.id);
        if (!existsSync(collectionDir) || !statSync(collectionDir).isDirectory()) {
            problems.push(`${collection.id}/: collection folder is missing`);
            continue;
        }
        const base = `${prefix}/${collection.id}`;
        validateCatalog(
            join(collectionDir, "catalog.md"),
            `${collection.id}/catalog.md`,
            collectionDir,
            base,
            problems
        );
        validateLessons(
            join(collectionDir, "projects"),
            `${collection.id}/projects`,
            problems
        );
    }

    return problems;
}

function validateCatalog(path, label, collectionDir, base, problems) {
    if (!existsSync(path)) {
        problems.push(`${label}: is missing`);
        return;
    }

    const text = readFileSync(path, "utf8");

    if (!HEADING.test(text)) {
        problems.push(`${label}: needs a "# Title" heading; it becomes the home-page row title`);
    }

    if (!CATEGORY_HEADING.test(text)) {
        problems.push(
            `${label}: needs a "## Category" heading; the editor collects cards only under one, so without it the collection renders no cards`
        );
    }

    const block = text.match(CODECARD_BLOCK);
    if (!block) {
        problems.push(`${label}: needs exactly one \`\`\`codecard fenced block`);
        return;
    }

    let cards;
    try {
        cards = JSON.parse(block[1]);
    } catch (e) {
        problems.push(`${label}: codecard block is not valid JSON (${e.message})`);
        return;
    }

    if (!Array.isArray(cards)) {
        problems.push(`${label}: codecard block must be a JSON array of cards`);
        return;
    }

    cards.forEach((card, i) => {
        const at = `${label}: card ${i + 1}`;

        if (!card || typeof card !== "object" || Array.isArray(card)) {
            problems.push(`${at}: must be a JSON object`);
            return;
        }

        for (const field of REQUIRED_CARD_FIELDS) {
            if (typeof card[field] !== "string" || !card[field].trim()) {
                problems.push(`${at}: "${field}" is required and must be a non-empty string`);
            }
        }

        if (typeof card.cardType === "string" && !CARD_TYPES.has(card.cardType)) {
            problems.push(
                `${at}: unsupported cardType "${card.cardType}"; supported types are ${[...CARD_TYPES].join(", ")}`
            );
        }

        if (typeof card.url === "string") {
            resolveInsideCollection(card.url, "url", base, collectionDir, ".md", at, problems);
        }
        if (typeof card.imageUrl === "string") {
            resolveInsideCollection(card.imageUrl, "imageUrl", base, collectionDir, "", at, problems);
        }
    });
}

function resolveInsideCollection(value, field, base, collectionDir, extension, at, problems) {
    if (!value.startsWith(`${base}/`)) {
        problems.push(`${at}: "${field}" must begin with "${base}/" so the editor can request it`);
        return;
    }

    const relativePath = value.slice(base.length + 1);
    const target = resolve(collectionDir, relativePath + extension);

    if (target !== resolve(collectionDir) && !target.startsWith(resolve(collectionDir) + sep)) {
        problems.push(`${at}: "${field}" must stay inside ${relative(process.cwd(), collectionDir) || "."}`);
        return;
    }

    if (!existsSync(target)) {
        problems.push(
            `${at}: "${field}" ${value} does not resolve to ${relative(collectionDir, target)}`
        );
    }
}

function validateLessons(projectsDir, label, problems) {
    if (!existsSync(projectsDir)) {
        problems.push(`${label}/: folder is missing`);
        return;
    }

    for (const name of readdirSync(projectsDir).sort()) {
        if (!name.endsWith(".md")) continue;
        const text = readFileSync(join(projectsDir, name), "utf8");
        if (!HEADING.test(text)) {
            problems.push(`${label}/${name}: lesson needs a "# Title" heading`);
        }
    }
}

const invokedDirectly =
    process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));

if (invokedDirectly) {
    const root = resolve(process.argv[2] ?? ".");
    const problems = validateRepo(root);

    if (problems.length) {
        console.error(`Content validation failed for ${root}:`);
        for (const problem of problems) console.error(`  - ${problem}`);
        process.exit(1);
    }

    const { collections } = JSON.parse(readFileSync(join(root, "config.json"), "utf8"));
    console.log(`Content OK: ${collections.length} collection(s) in ${root}`);
}
