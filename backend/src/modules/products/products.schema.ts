import { z } from 'zod';

const slugSchema = z
  .string()
  .trim()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'category must be a slug like mens-clothing');

export const listProductsQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(12),
    category: slugSchema.optional(),
    minPrice: z.coerce.number().min(0).optional(),
    maxPrice: z.coerce.number().min(0).optional(),
    sort: z.enum(['price_asc', 'price_desc', 'rating_desc', 'newest']).optional(),
    q: z.string().trim().max(100).optional(),
  })
  .refine(
    (data) =>
      data.minPrice === undefined || data.maxPrice === undefined || data.minPrice <= data.maxPrice,
    {
      message: 'minPrice must be less than or equal to maxPrice',
      path: ['minPrice'],
    },
  );

export const productIdParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export type ListProductsQuery = z.infer<typeof listProductsQuerySchema>;
export type ProductIdParams = z.infer<typeof productIdParamsSchema>;
