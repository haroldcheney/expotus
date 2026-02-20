import { defineCollection, z } from 'astro:content';

const factSchema = z.object({
  detail: z.string(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  citation: z.string().optional(),
  citationDate: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.citation && !data.citationDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'citationDate is required when citation is provided',
      path: ['citationDate'],
    });
  }
});

const presidents = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.number(),
    firstName: z.string(),
    lastName: z.string(),
    uniqueName: z.string().optional(),
    startDate: z.string(),
    endDate: z.string().optional(),
    startTime: z.number().default(0),
    endTime: z.number().default(0),
    facts: z.array(factSchema).default([]),
  }),
});

export const collections = { presidents };
