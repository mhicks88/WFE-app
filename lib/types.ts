import { z } from "zod";

// Zod schema for barrel classification rules (canonical WFE data)
export const BarrelRuleSchema = z.object({
  id: z.string(),
  patternLabel: z.string(), // e.g. "9x-12x", "(1)22xx", "604?-62xx"
  minCode: z.number(),
  maxCode: z.number(),
  description: z.string(), // Exact canonical text (e.g. "low rye rye", "orignal mashbill bourbon", "??? mashbill bourbon")
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

// Type for barrel decoder result
export type BarrelDecodeResult = {
  barrelCode: string;
  matched: boolean;
  rule: BarrelRule | null;
  description: string; // The exact canonical description
  patternLabel: string | null;
};
