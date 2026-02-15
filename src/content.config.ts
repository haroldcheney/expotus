import { defineCollection, z } from 'astro:content';

const factSchema = z.object({
  detail: z.string(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  citation: z.string().optional(),
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
