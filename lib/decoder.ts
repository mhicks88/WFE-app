import { readFileSync } from "fs";
import { join } from "path";
import {
  MashbillSchema,
  BarrelRuleSchema,
  WillettReleaseSchema,
  type Mashbill,
  type BarrelRule,
  type WillettRelease,
  type BarrelDecodeResult,
} from "./types";

/**
 * Loads mashbill metadata from mashbills.json
 * @returns Array of validated mashbills
 */
function loadMashbills(): Mashbill[] {
  const dataPath = join(process.cwd(), "data", "mashbills.json");

  let rawData: unknown;
  try {
    const fileContents = readFileSync(dataPath, "utf-8");
    rawData = JSON.parse(fileContents);
  } catch (error) {
    throw new Error(
      `Failed to read or parse mashbills.json: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  if (!Array.isArray(rawData)) {
    throw new Error("mashbills.json must contain an array of mashbills");
  }

  const validatedMashbills: Mashbill[] = [];
  const validationErrors: Array<{ index: number; errors: string[] }> = [];

  rawData.forEach((item, index) => {
    const result = MashbillSchema.safeParse(item);
    if (!result.success) {
      const errors = result.error.issues.map(
        (issue) => `${issue.path.join(".")}: ${issue.message}`
      );
      validationErrors.push({ index, errors });
    } else {
      validatedMashbills.push(result.data);
    }
  });

  if (validationErrors.length > 0) {
    const errorMessages = validationErrors.map((err) =>
      `  Entry ${err.index}:\n    - ${err.errors.join("\n    - ")}`
    );
    throw new Error(
      `Validation failed for ${validationErrors.length} mashbill(s) in mashbills.json:\n\n${errorMessages.join("\n\n")}`
    );
  }

  return validatedMashbills;
}

/**
 * Loads barrel classification rules from barrel-rules.json
 * @returns Array of validated barrel rules
 */
function loadBarrelRules(): BarrelRule[] {
  const dataPath = join(process.cwd(), "data", "barrel-rules.json");

  let rawData: unknown;
  try {
    const fileContents = readFileSync(dataPath, "utf-8");
    rawData = JSON.parse(fileContents);
  } catch (error) {
    throw new Error(
      `Failed to read or parse barrel-rules.json: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  if (!Array.isArray(rawData)) {
    throw new Error("barrel-rules.json must contain an array of rules");
  }

  const validatedRules: BarrelRule[] = [];
  const validationErrors: Array<{ index: number; errors: string[] }> = [];

  rawData.forEach((item, index) => {
    const result = BarrelRuleSchema.safeParse(item);
    if (!result.success) {
      const errors = result.error.issues.map(
        (issue) => `${issue.path.join(".")}: ${issue.message}`
      );
      validationErrors.push({ index, errors });
    } else {
      validatedRules.push(result.data);
    }
  });

  if (validationErrors.length > 0) {
    const errorMessages = validationErrors.map((err) =>
      `  Entry ${err.index}:\n    - ${err.errors.join("\n    - ")}`
    );
    throw new Error(
      `Validation failed for ${validationErrors.length} rule(s) in barrel-rules.json:\n\n${errorMessages.join("\n\n")}`
    );
  }

  return validatedRules;
}

/**
 * Loads known Willett releases from releases.json
 * @returns Array of validated releases
 */
function loadReleases(): WillettRelease[] {
  const dataPath = join(process.cwd(), "data", "releases.json");

  let rawData: unknown;
  try {
    const fileContents = readFileSync(dataPath, "utf-8");
    rawData = JSON.parse(fileContents);
  } catch (error) {
    throw new Error(
      `Failed to read or parse releases.json: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  if (!Array.isArray(rawData)) {
    throw new Error("releases.json must contain an array of releases");
  }

  const validatedReleases: WillettRelease[] = [];
  const validationErrors: Array<{ index: number; errors: string[] }> = [];

  rawData.forEach((item, index) => {
    const result = WillettReleaseSchema.safeParse(item);
    if (!result.success) {
      const errors = result.error.issues.map(
        (issue) => `${issue.path.join(".")}: ${issue.message}`
      );
      validationErrors.push({ index, errors });
    } else {
      validatedReleases.push(result.data);
    }
  });

  if (validationErrors.length > 0) {
    const errorMessages = validationErrors.map((err) =>
      `  Entry ${err.index}:\n    - ${err.errors.join("\n    - ")}`
    );
    throw new Error(
      `Validation failed for ${validationErrors.length} release(s) in releases.json:\n\n${errorMessages.join("\n\n")}`
    );
  }

  return validatedReleases;
}

/**
 * Gets all mashbills
 */
export function getAllMashbills(): Mashbill[] {
  return loadMashbills();
}

/**
 * Gets a single mashbill by ID
 * @param id - The mashbill ID to look up
 * @returns The mashbill or null if not found
 */
export function getMashbillById(id: string): Mashbill | null {
  const mashbills = loadMashbills();
  return mashbills.find((m) => m.id === id) || null;
}

/**
 * Gets all barrel classification rules
 */
export function getAllBarrelRules(): BarrelRule[] {
  return loadBarrelRules();
}

/**
 * Gets all known Willett releases
 */
export function getAllReleases(): WillettRelease[] {
  return loadReleases();
}

/**
 * Decodes a barrel code using canonical WFE classification data
 * @param barrelCode - The barrel code to decode
 * @returns Decode result with matching rule and full mashbill metadata
 */
export function decodeBarrel(barrelCode: string): BarrelDecodeResult {
  const code = parseInt(barrelCode, 10);

  if (isNaN(code)) {
    return {
      barrelCode,
      matched: false,
      rule: null,
      mashbill: null,
      patternLabel: null,
      barrelNotes: null,
    };
  }

  const rules = getAllBarrelRules();

  // Sort rules by specificity (most specific first: smaller range = more specific)
  // Also prioritize exact matches (minCode === maxCode)
  const sortedRules = [...rules].sort((a, b) => {
    const aIsExact = a.minCode === a.maxCode;
    const bIsExact = b.minCode === b.maxCode;

    if (aIsExact && !bIsExact) return -1;
    if (!aIsExact && bIsExact) return 1;

    const aRange = a.maxCode - a.minCode;
    const bRange = b.maxCode - b.minCode;
    return aRange - bRange;
  });

  // Find the first matching rule
  for (const rule of sortedRules) {
    if (code >= rule.minCode && code <= rule.maxCode) {
      // Look up the mashbill metadata if mashbillId is present
      const mashbill = rule.mashbillId ? getMashbillById(rule.mashbillId) : null;

      return {
        barrelCode,
        matched: true,
        rule,
        mashbill,
        patternLabel: rule.patternLabel,
        barrelNotes: rule.notes,
      };
    }
  }

  // No match found
  return {
    barrelCode,
    matched: false,
    rule: null,
    mashbill: null,
    patternLabel: null,
    barrelNotes: null,
  };
}

/**
 * Searches barrel rules by pattern label or notes
 * @param query - Search query
 * @returns Matching rules
 */
export function searchBarrelRules(query: string): BarrelRule[] {
  if (!query.trim()) {
    return getAllBarrelRules();
  }

  const rules = getAllBarrelRules();
  const lowerQuery = query.toLowerCase();

  return rules.filter((rule) => {
    return (
      rule.patternLabel.toLowerCase().includes(lowerQuery) ||
      rule.notes?.toLowerCase().includes(lowerQuery)
    );
  });
}

/**
 * Searches releases by barrel code, label name, or selected for
 * @param query - Search query
 * @returns Matching releases
 */
export function searchReleases(query: string): WillettRelease[] {
  if (!query.trim()) {
    return getAllReleases();
  }

  const releases = getAllReleases();
  const lowerQuery = query.toLowerCase();

  return releases.filter((release) => {
    return (
      release.barrelCode.toLowerCase().includes(lowerQuery) ||
      release.labelName.toLowerCase().includes(lowerQuery) ||
      release.selectedFor?.toLowerCase().includes(lowerQuery) ||
      release.city?.toLowerCase().includes(lowerQuery) ||
      release.state?.toLowerCase().includes(lowerQuery)
    );
  });
}
