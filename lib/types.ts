import { z } from "zod";

// Zod schema for runtime validation of bottle data
export const BottleSchema = z.object({
  id: z.string(),
  barrelCode: z.string(),
  labelName: z.string(),
  ageStatement: z.string().optional(),
  proof: z.number().optional(),
  selectedFor: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  acquiredDate: z.string().optional(),
  pricePaid: z.number().optional(),
  rating: z.number().min(0).max(10).optional(),
  tastingNotes: z.string().optional(),
  comments: z.string().optional(),
});

// Type inferred from schema for the base bottle data (before classification)
export type BottleData = z.infer<typeof BottleSchema>;

// Extended type that includes computed classification fields
export type Bottle = BottleData & {
  mashbillType: string;
  entryProofCategory: string | null;
  classificationNotes: string | null;
};

// Type for the classification result
export type BarrelClassification = {
  mashbillType: string;
  entryProofCategory: string | null;
  classificationNotes: string | null;
};
