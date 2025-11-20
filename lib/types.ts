import { z } from "zod";

// Zod schema for mashbill metadata (grain bill, entry proof, tasting notes, etc.)
export const MashbillSchema = z.object({
  id: z.string(), // e.g. "high_corn_low_entry", "original_bourbon"
  displayName: z.string(), // e.g. "High Corn Low Entry"
  whiskeyType: z.string(), // e.g. "bourbon", "straight rye whiskey", "four-grain bourbon"
  grainBill: z.object({
    corn: z.number(),
    rye: z.number(),
    wheat: z.number(),
    maltedBarley: z.number(),
  }),
  entryProof: z.number().nullable(), // Barrel entry proof (null if unknown)
  status: z.string(), // e.g. "active", "discontinued", "experimental"
  sourceDistillery: z.string(), // e.g. "Willett Distillery"
  tastingNotes: z.string(), // Typical flavor profile for this mashbill
  notes: z.string(), // Additional historical or technical notes
});

// Type inferred from schema
export type Mashbill = z.infer<typeof MashbillSchema>;

// Zod schema for barrel classification rules (linking barrel ranges to mashbills)
export const BarrelRuleSchema = z.object({
  id: z.string(),
  patternLabel: z.string(), // e.g. "9x-12x", "(1)22xx", "604?-62xx"
  minCode: z.number(),
  maxCode: z.number(),
  mashbillId: z.string().nullable(), // References Mashbill.id (null if unknown mashbill like 771x)
  notes: z.string().nullable(), // Special notes (e.g. "Hoffmeister barrels", "Char 1", "Experimental")
});

// Type inferred from schema
export type BarrelRule = z.infer<typeof BarrelRuleSchema>;

// Zod schema for known Willett releases (public data)
export const WillettReleaseSchema = z.object({
  id: z.string(),
  barrelCode: z.string(),
  labelName: z.string(),
  ageStatement: z.string().optional(),
  proof: z.number().optional(),
  selectedFor: z.string().optional(), // Store or barrel pick group
  city: z.string().optional(),
  state: z.string().optional(),
  releaseYear: z.number().optional(), // When it was released
});

// Type inferred from schema
export type WillettRelease = z.infer<typeof WillettReleaseSchema>;

// Type for barrel decoder result (enriched with full mashbill metadata)
export type BarrelDecodeResult = {
  barrelCode: string;
  matched: boolean;
  rule: BarrelRule | null;
  mashbill: Mashbill | null; // Full mashbill metadata (null if unknown)
  patternLabel: string | null;
  barrelNotes: string | null; // Special barrel-specific notes (from BarrelRule.notes)
};
