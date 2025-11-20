import { z } from "zod";

// Zod schema for barrel classification rules
export const BarrelRuleSchema = z.object({
  id: z.string(),
  minCode: z.number(),
  maxCode: z.number(),
  patternLabel: z.string(), // e.g. "90xx-91xx", "17xx", "321xx"
  mashbillType: z.string(),
  entryProofCategory: z.string().nullable(),
  notes: z.string().nullable(),
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
  mashbillType: string;
  entryProofCategory: string | null;
  patternLabel: string | null;
  notes: string | null;
};
