import { readFileSync } from "fs";
import { join } from "path";
import { BottleSchema, type Bottle, type BottleData } from "./types";
import { classifyBarrel } from "./classifyBarrel";

/**
 * Reads and parses the willett-barrels.json file
 * @returns Array of validated bottle data
 */
function loadBottleData(): BottleData[] {
  const dataPath = join(process.cwd(), "data", "willett-barrels.json");
  const fileContents = readFileSync(dataPath, "utf-8");
  const rawData = JSON.parse(fileContents);

  // Validate each bottle against the Zod schema
  if (!Array.isArray(rawData)) {
    throw new Error("willett-barrels.json must contain an array of bottles");
  }

  return rawData.map((item, index) => {
    const result = BottleSchema.safeParse(item);
    if (!result.success) {
      console.error(`Validation error at index ${index}:`, result.error);
      throw new Error(`Invalid bottle data at index ${index}`);
    }
    return result.data;
  });
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
