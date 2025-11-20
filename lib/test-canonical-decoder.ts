/**
 * Test file to verify canonical WFE barrel code classification
 */

import { decodeBarrel } from "./decoder";

console.log("=".repeat(80));
console.log("CANONICAL WFE BARREL CODE DECODER TEST");
console.log("=".repeat(80));
console.log();

const testCodes = [
  "9081",  // Should be "wheated mashbill bourbon"
  "17123", // Should be "original mashbill"
  "20361", // Should be "a high rye rye"
  "32145", // Should be "four grain mashbill (55/12/18/15) in American oak"
  "38310", // Should be "high rye bourbon mashbill (char 1)"
  "4728",  // Should be "high rye bourbon"
  "2650",  // Should be "orignal mashbill bourbon" (with the typo)
  "7713",  // Should be "??? mashbill bourbon"
  "12258", // Should match one of the duplicate (1)22xx rules
  "8612",  // Should be "rye aged in Hoffmeister barrels"
  "253",   // Should be "low rye rye" (22x-23x range)
  "11855", // Should be "an original mashbill bourbon" (exact match)
];

testCodes.forEach((code) => {
  const result = decodeBarrel(code);

  console.log(`Barrel Code: ${code}`);
  console.log(`  Matched: ${result.matched ? "YES" : "NO"}`);

  if (result.matched) {
    console.log(`  Pattern: ${result.patternLabel}`);
    console.log(`  Description: "${result.description}"`);

    if (result.rule) {
      console.log(`  Range: ${result.rule.minCode} - ${result.rule.maxCode}`);
    }
  } else {
    console.log(`  Description: "${result.description}"`);
  }

  console.log();
});

console.log("=".repeat(80));
console.log("TEST COMPLETE");
console.log("=".repeat(80));
