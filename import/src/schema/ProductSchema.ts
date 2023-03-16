import { z } from 'zod';

export const productCreateSchema = z.object({
  title: z.string(),
  description: z.string(),
  price: z.number(),
  count: z.number().optional(),
}, {});

