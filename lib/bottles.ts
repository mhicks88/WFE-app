import { readFileSync } from "fs";
import { join } from "path";
import { BottleSchema, type Bottle, type BottleData } from "./types";
import { classifyBarrel } from "./classifyBarrel";

/**
 * Reads and parses the willett-barrels.json file
 * @returns Array of validated bottle data
 * @throws Error with detailed validation failures if any entries are invalid
 */
function loadBottleData(): BottleData[] {
  const dataPath = join(process.cwd(), "data", "willett-barrels.json");

  // Read and parse JSON file
  let rawData: unknown;
  try {
    const fileContents = readFileSync(dataPath, "utf-8");
    rawData = JSON.parse(fileContents);
  } catch (error) {
    throw new Error(
      `Failed to read or parse willett-barrels.json: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  // Validate that root is an array
  if (!Array.isArray(rawData)) {
    throw new Error(
      "Invalid data format: willett-barrels.json must contain an array of bottles"
    );
  }

  // Validate each bottle and collect all errors
  const validatedBottles: BottleData[] = [];
  const validationErrors: Array<{ index: number; id?: string; errors: string[] }> = [];

  rawData.forEach((item, index) => {
    const result = BottleSchema.safeParse(item);
    if (!result.success) {
      // Extract readable error messages from Zod
      const errors = result.error.issues.map(
        (issue) => `${issue.path.join(".")}: ${issue.message}`
      );
      validationErrors.push({
        index,
        id: typeof item === "object" && item !== null && "id" in item
          ? String(item.id)
          : undefined,
        errors,
      });
    } else {
      validatedBottles.push(result.data);
    }
  });

  // If there were any validation errors, throw a comprehensive error
  if (validationErrors.length > 0) {
    const errorMessages = validationErrors.map((err) => {
      const idInfo = err.id ? ` (id: "${err.id}")` : "";
      return `  Entry ${err.index}${idInfo}:\n    - ${err.errors.join("\n    - ")}`;
    });

    throw new Error(
      `Validation failed for ${validationErrors.length} bottle(s) in willett-barrels.json:\n\n${errorMessages.join("\n\n")}\n\nPlease fix these entries and try again.`
    );
  }

  return validatedBottles;
}

/**
 * Merges bottle data with computed classification fields
 * @param bottleData - Raw bottle data without classification
 * @returns Bottle with classification fields
 */
function enrichBottle(bottleData: BottleData): Bottle {
  const classification = classifyBarrel(bottleData.barrelCode);
  return {
    ...bottleData,
    ...classification,
  };
}

/**
 * Gets all bottles with classification data
 * @returns Array of all bottles with mashbill classification
 */
export function getAllBottles(): Bottle[] {
  const bottleData = loadBottleData();
  return bottleData.map(enrichBottle);
}

/**
 * Gets a single bottle by ID
 * @param id - The bottle ID to look up
 * @returns The bottle if found, or null
 */
export function getBottleById(id: string): Bottle | null {
  const bottles = getAllBottles();
  return bottles.find((bottle) => bottle.id === id) || null;
}

/**
 * Searches bottles by barrel code, label name, or selected for
 * @param query - Search query string
 * @returns Array of matching bottles
 */
export function searchBottles(query: string): Bottle[] {
  if (!query.trim()) {
    return getAllBottles();
  }

  const bottles = getAllBottles();
  const lowerQuery = query.toLowerCase();

  return bottles.filter((bottle) => {
    return (
      bottle.barrelCode.toLowerCase().includes(lowerQuery) ||
      bottle.labelName.toLowerCase().includes(lowerQuery) ||
      bottle.selectedFor?.toLowerCase().includes(lowerQuery) ||
      bottle.mashbillType.toLowerCase().includes(lowerQuery)
    );
  });
}

/**
 * Filters bottles by proof range
 * @param minProof - Minimum proof (inclusive)
 * @param maxProof - Maximum proof (inclusive)
 * @returns Array of bottles within the proof range
 */
export function filterBottlesByProof(
  bottles: Bottle[],
  minProof?: number,
  maxProof?: number
): Bottle[] {
  return bottles.filter((bottle) => {
    if (bottle.proof === undefined) return false;
    if (minProof !== undefined && bottle.proof < minProof) return false;
    if (maxProof !== undefined && bottle.proof > maxProof) return false;
    return true;
  });
}
