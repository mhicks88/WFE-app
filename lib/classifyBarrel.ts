import type { BarrelClassification } from "./types";

/**
 * Classifies a Willett barrel based on its barrel code using internal numbering schemes.
 *
 * @param barrelCode - The barrel code as a string (e.g., "9081", "17123", "20361")
 * @returns Classification object with mashbillType, entryProofCategory, and classificationNotes
 */
export function classifyBarrel(barrelCode: string): BarrelClassification {
  // Normalize barrel code to integer
  const code = parseInt(barrelCode, 10);

  // Handle invalid codes
  if (isNaN(code)) {
    return {
      mashbillType: "unknown",
      entryProofCategory: null,
      classificationNotes: "invalid barrel code - not a number",
    };
  }

  // Helper function to check if code is in range (inclusive)
  const inRange = (min: number, max: number): boolean => code >= min && code <= max;

  // Check 5-digit extended series first (most specific)

  // Exact match
  if (code === 11855) {
    return {
      mashbillType: "original mashbill bourbon",
      entryProofCategory: null,
      classificationNotes: null,
    };
  }

  // 5-digit ranges
  if (inRange(10500, 10599)) {
    return {
      mashbillType: "original mashbill bourbon",
      entryProofCategory: null,
      classificationNotes: null,
    };
  }

  if (inRange(11200, 11299)) {
    return {
      mashbillType: "experimental wheater",
      entryProofCategory: null,
      classificationNotes: null,
    };
  }

  if (inRange(12000, 12099)) {
    return {
      mashbillType: "wheated mashbill bourbon",
      entryProofCategory: null,
      classificationNotes: null,
    };
  }

  // Ambiguous case for 122xx
  if (inRange(12200, 12299)) {
    return {
      mashbillType: "high rye rye / original mashbill bourbon",
      entryProofCategory: null,
      classificationNotes: "ambiguous - could be either high rye rye or original mashbill bourbon",
    };
  }

  if (inRange(12300, 12399)) {
    return {
      mashbillType: "wheated mashbill bourbon",
      entryProofCategory: null,
      classificationNotes: null,
    };
  }

  if (inRange(12500, 12599)) {
    return {
      mashbillType: "original mashbill bourbon",
      entryProofCategory: null,
      classificationNotes: null,
    };
  }

  if (inRange(13000, 13099)) {
    return {
      mashbillType: "high corn",
      entryProofCategory: "high entry proof",
      classificationNotes: null,
    };
  }

  if (inRange(13200, 13299)) {
    return {
      mashbillType: "original mashbill bourbon",
      entryProofCategory: null,
      classificationNotes: null,
    };
  }

  if (inRange(17200, 17299)) {
    return {
      mashbillType: "original mashbill bourbon",
      entryProofCategory: null,
      classificationNotes: null,
    };
  }

  if (inRange(18200, 18299)) {
    return {
      mashbillType: "high corn",
      entryProofCategory: "high entry proof",
      classificationNotes: null,
    };
  }

  if (inRange(19300, 19399)) {
    return {
      mashbillType: "high rye rye",
      entryProofCategory: null,
      classificationNotes: null,
    };
  }

  if (inRange(19500, 19599)) {
    return {
      mashbillType: "wheated mashbill bourbon",
      entryProofCategory: null,
      classificationNotes: null,
    };
  }

  if (inRange(20300, 20399)) {
    return {
      mashbillType: "high rye rye",
      entryProofCategory: null,
      classificationNotes: null,
    };
  }

  if (inRange(20700, 20799)) {
    return {
      mashbillType: "high corn",
      entryProofCategory: "high entry proof",
      classificationNotes: null,
    };
  }

  if (inRange(22500, 22599)) {
    return {
      mashbillType: "original mashbill bourbon",
      entryProofCategory: null,
      classificationNotes: null,
    };
  }

  if (inRange(22600, 23199)) {
    return {
      mashbillType: "high rye rye",
      entryProofCategory: null,
      classificationNotes: null,
    };
  }

  if (inRange(25300, 25399)) {
    return {
      mashbillType: "experimental wheated mashbill",
      entryProofCategory: null,
      classificationNotes: "aged in cured oak",
    };
  }

  if (inRange(25500, 25599)) {
    return {
      mashbillType: "original mashbill bourbon",
      entryProofCategory: null,
      classificationNotes: null,
    };
  }

  if (inRange(29400, 29499)) {
    return {
      mashbillType: "wheated mashbill bourbon",
      entryProofCategory: null,
      classificationNotes: null,
    };
  }

  if (inRange(32100, 32199)) {
    return {
      mashbillType: "four grain mashbill (55/12/18/15)",
      entryProofCategory: null,
      classificationNotes: "aged in American oak",
    };
  }

  if (inRange(33800, 33899)) {
    return {
      mashbillType: "original mashbill bourbon",
      entryProofCategory: null,
      classificationNotes: null,
    };
  }

  if (inRange(38300, 38399)) {
    return {
      mashbillType: "high rye bourbon",
      entryProofCategory: null,
      classificationNotes: "char 1",
    };
  }

  // Check 4-digit ranges

  if (inRange(1000, 1099)) {
    return {
      mashbillType: "original mashbill",
      entryProofCategory: null,
      classificationNotes: null,
    };
  }

  if (inRange(1400, 1499)) {
    return {
      mashbillType: "low rye rye",
      entryProofCategory: null,
      classificationNotes: null,
    };
  }

  if (inRange(1700, 1799)) {
    return {
      mashbillType: "original mashbill",
      entryProofCategory: null,
      classificationNotes: null,
    };
  }

  if (inRange(1900, 2199)) {
    return {
      mashbillType: "high corn",
      entryProofCategory: "high entry proof",
      classificationNotes: null,
    };
  }

  if (inRange(2200, 2599)) {
    return {
      mashbillType: "high rye rye",
      entryProofCategory: null,
      classificationNotes: null,
    };
  }

  if (inRange(2600, 2899)) {
    return {
      mashbillType: "original mashbill bourbon",
      entryProofCategory: null,
      classificationNotes: null,
    };
  }

  if (inRange(3000, 3099)) {
    return {
      mashbillType: "original mashbill bourbon",
      entryProofCategory: null,
      classificationNotes: null,
    };
  }

  if (inRange(3100, 3199)) {
    return {
      mashbillType: "high rye mashbill bourbon",
      entryProofCategory: null,
      classificationNotes: null,
    };
  }

  if (inRange(3200, 3579)) {
    return {
      mashbillType: "wheated mashbill bourbon",
      entryProofCategory: null,
      classificationNotes: null,
    };
  }

  if (inRange(3580, 3699)) {
    return {
      mashbillType: "low rye rye",
      entryProofCategory: null,
      classificationNotes: null,
    };
  }

  if (inRange(3800, 4499)) {
    return {
      mashbillType: "original mashbill bourbon",
      entryProofCategory: null,
      classificationNotes: null,
    };
  }

  if (inRange(4700, 4899)) {
    return {
      mashbillType: "high rye bourbon",
      entryProofCategory: null,
      classificationNotes: null,
    };
  }

  if (inRange(5000, 5199)) {
    return {
      mashbillType: "original mashbill bourbon",
      entryProofCategory: null,
      classificationNotes: null,
    };
  }

  if (inRange(5190, 5284)) {
    return {
      mashbillType: "high corn bourbon",
      entryProofCategory: null,
      classificationNotes: null,
    };
  }

  if (inRange(5285, 5399)) {
    return {
      mashbillType: "high rye bourbon",
      entryProofCategory: null,
      classificationNotes: null,
    };
  }

  if (inRange(5500, 5999)) {
    return {
      mashbillType: "original mashbill bourbon",
      entryProofCategory: null,
      classificationNotes: null,
    };
  }

  // Note: 59xx overlaps with the above range, but the next rule starts at 5900
  if (inRange(5900, 6049)) {
    return {
      mashbillType: "high rye bourbon",
      entryProofCategory: null,
      classificationNotes: null,
    };
  }

  if (inRange(6040, 6299)) {
    return {
      mashbillType: "high rye rye",
      entryProofCategory: null,
      classificationNotes: null,
    };
  }

  if (inRange(6400, 6599)) {
    return {
      mashbillType: "high corn",
      entryProofCategory: "high entry proof",
      classificationNotes: null,
    };
  }

  if (inRange(6600, 6799)) {
    return {
      mashbillType: "original mashbill bourbon",
      entryProofCategory: null,
      classificationNotes: null,
    };
  }

  if (inRange(7000, 7199)) {
    return {
      mashbillType: "original mashbill bourbon",
      entryProofCategory: null,
      classificationNotes: null,
    };
  }

  if (inRange(7200, 7299)) {
    return {
      mashbillType: "wheated mashbill bourbon",
      entryProofCategory: null,
      classificationNotes: null,
    };
  }

  if (inRange(7400, 7499)) {
    return {
      mashbillType: "original mashbill bourbon",
      entryProofCategory: null,
      classificationNotes: null,
    };
  }

  if (inRange(7700, 7709)) {
    return {
      mashbillType: "high rye rye",
      entryProofCategory: null,
      classificationNotes: null,
    };
  }

  if (inRange(7710, 7719)) {
    return {
      mashbillType: "unknown mashbill",
      entryProofCategory: null,
      classificationNotes: null,
    };
  }

  if (inRange(8100, 8299)) {
    return {
      mashbillType: "original mashbill bourbon",
      entryProofCategory: null,
      classificationNotes: null,
    };
  }

  if (inRange(8600, 8699)) {
    return {
      mashbillType: "rye",
      entryProofCategory: null,
      classificationNotes: "aged in Hoffmeister barrels",
    };
  }

  if (inRange(9000, 9199)) {
    return {
      mashbillType: "wheated mashbill bourbon",
      entryProofCategory: null,
      classificationNotes: null,
    };
  }

  if (inRange(9300, 9599)) {
    return {
      mashbillType: "high rye rye",
      entryProofCategory: null,
      classificationNotes: null,
    };
  }

  if (inRange(9700, 9799)) {
    return {
      mashbillType: "low rye rye",
      entryProofCategory: null,
      classificationNotes: null,
    };
  }

  // Check 3-digit ranges (with 'x' notation)

  if (inRange(90, 129)) {
    return {
      mashbillType: "low rye rye",
      entryProofCategory: null,
      classificationNotes: null,
    };
  }

  if (inRange(140, 209)) {
    return {
      mashbillType: "original mashbill",
      entryProofCategory: null,
      classificationNotes: null,
    };
  }

  if (inRange(220, 239)) {
    return {
      mashbillType: "low rye rye",
      entryProofCategory: null,
      classificationNotes: null,
    };
  }

  if (inRange(390, 409)) {
    return {
      mashbillType: "original mashbill",
      entryProofCategory: null,
      classificationNotes: null,
    };
  }

  if (inRange(420, 429)) {
    return {
      mashbillType: "high rye rye",
      entryProofCategory: null,
      classificationNotes: null,
    };
  }

  if (inRange(600, 639)) {
    return {
      mashbillType: "low rye rye",
      entryProofCategory: null,
      classificationNotes: null,
    };
  }

  if (inRange(650, 729)) {
    return {
      mashbillType: "high corn",
      entryProofCategory: "low entry proof",
      classificationNotes: null,
    };
  }

  if (inRange(980, 989)) {
    return {
      mashbillType: "high rye rye",
      entryProofCategory: null,
      classificationNotes: null,
    };
  }

  // No matching rule
  return {
    mashbillType: "unknown",
    entryProofCategory: null,
    classificationNotes: "no classification rule for this barrel range",
  };
}
