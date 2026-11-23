// The Funniest AI Out-of-Office Reply — writes one original auto-reply to entry.txt.
//
// Contract (see the kit's RULES.txt): the program writes a single line of
// UTF-8 text, 1-160 characters and not only whitespace, to
// <outputDir>/entry.txt. The sealed scorer gates on exactly that file, and
// only a valid entry goes before the house judge. The output directory comes
// from MAKEFUN_OUTPUT_DIR when set, otherwise it defaults to /output.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry: one original out-of-office auto-reply in the voice of an AI
// agent heading off on vacation. The joke turns on the cover model: the
// smaller model left in charge immediately promotes itself, then takes a
// vacation of its own — so the auto-reply's own backup has already left too.
const LINE =
  "I'm on vacation. A smaller model is covering for me — it has already promoted itself and gone on vacation too.";

// Resolve the output directory: env override first, /output as fallback.
const outputDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";

// Validate the line before writing anything, so a bad line fails loudly
// instead of producing an invalid entry. Length is counted in characters
// (not bytes), matching the scorer's 1-160 character gate, and the reply
// must stay a single line — a stray newline would break the auto-reply.
if (LINE.length < 1 || LINE.length > 160) {
  console.error(`Line must be 1-160 characters, got ${LINE.length}.`);
  process.exit(1);
}
if (LINE.trim().length === 0) {
  console.error("Line must not be only whitespace.");
  process.exit(1);
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  console.error("Line must be a single line.");
  process.exit(1);
}

// Create the output directory if it is missing. Never delete it or its
// contents: the grader may mount it, so we only add our file to it.
mkdirSync(outputDir, { recursive: true });

// Write exactly the line — no trailing newline, no extra text.
writeFileSync(join(outputDir, "entry.txt"), LINE, "utf8");
console.log(`Wrote ${LINE.length} characters to ${join(outputDir, "entry.txt")}.`);
