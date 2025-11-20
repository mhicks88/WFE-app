/**
 * Unit tests for classifyBarrel function
 *
 * These tests verify that specific barrel codes map to the correct mashbill types
 * based on Willett's internal numbering schemes.
 */

import { classifyBarrel } from "./classifyBarrel";

// Test cases for specific barrel codes
const testCases = [
  {
    barrelCode: "9081",
    expected: {
      mashbillType: "wheated mashbill bourbon",
      entryProofCategory: null,
      classificationNotes: null,
    },
    description: "9081 is in range 9000-9199 (90xx-91xx) → wheated mashbill bourbon",
  },
  {
    barrelCode: "17123",
    expected: {
      mashbillType: "original mashbill",
      entryProofCategory: null,
      classificationNotes: null,
    },
    description: "17123 is a 5-digit code starting with 17 → should map to original mashbill",
  },
  {
    barrelCode: "20361",
    expected: {
      mashbillType: "high rye rye",
      entryProofCategory: null,
      classificationNotes: null,
    },
    description: "20361 is in range 20300-20399 (203xx) → high rye rye",
  },
  {
    barrelCode: "32101",
    expected: {
      mashbillType: "four grain mashbill (55/12/18/15)",
      entryProofCategory: null,
      classificationNotes: "aged in American oak",
    },
    description: "32101 is in range 32100-32199 (321xx) → four grain mashbill in American oak",
  },
  {
    barrelCode: "38310",
    expected: {
      mashbillType: "high rye bourbon",
      entryProofCategory: null,
      classificationNotes: "char 1",
    },
    description: "38310 is in range 38300-38399 (383xx) → high rye bourbon with char 1",
  },
];

// Run tests and log results
console.log("=".repeat(80));
console.log("BARREL CLASSIFICATION TEST RESULTS");
console.log("=".repeat(80));
console.log();

let passCount = 0;
let failCount = 0;

testCases.forEach((testCase, index) => {
  const result = classifyBarrel(testCase.barrelCode);
  const passed =
    result.mashbillType === testCase.expected.mashbillType &&
    result.entryProofCategory === testCase.expected.entryProofCategory &&
    result.classificationNotes === testCase.expected.classificationNotes;

  console.log(`Test ${index + 1}: ${testCase.barrelCode}`);
  console.log(`Description: ${testCase.description}`);
  console.log(`Status: ${passed ? "✓ PASS" : "✗ FAIL"}`);
  console.log();
  console.log(`Expected:`);
  console.log(`  Mashbill Type: "${testCase.expected.mashbillType}"`);
  console.log(`  Entry Proof: ${testCase.expected.entryProofCategory}`);
  console.log(`  Notes: ${testCase.expected.classificationNotes}`);
  console.log();
  console.log(`Actual:`);
  console.log(`  Mashbill Type: "${result.mashbillType}"`);
  console.log(`  Entry Proof: ${result.entryProofCategory}`);
  console.log(`  Notes: ${result.classificationNotes}`);
  console.log();

  if (!passed) {
    console.log(`❌ MISMATCH DETECTED`);
    if (result.mashbillType !== testCase.expected.mashbillType) {
      console.log(`  - Mashbill type differs`);
    }
    if (result.entryProofCategory !== testCase.expected.entryProofCategory) {
      console.log(`  - Entry proof category differs`);
    }
    if (result.classificationNotes !== testCase.expected.classificationNotes) {
      console.log(`  - Classification notes differ`);
    }
  }

  console.log("-".repeat(80));
  console.log();

  if (passed) {
    passCount++;
  } else {
    failCount++;
  }
});

console.log("=".repeat(80));
console.log(`SUMMARY: ${passCount} passed, ${failCount} failed out of ${testCases.length} tests`);
console.log("=".repeat(80));

// Export for use in other files
export { testCases };
