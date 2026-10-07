import { z } from 'zod';
import { optionalText, optionalUrl } from './common.schema';

export const brandProfileSchema = z.object({
  companyName: z.string().trim().min(2, 'At least 2 characters').max(120),
  website: optionalUrl,
  industry: optionalText(40),
  country: z.union([z.literal(''), z.string().length(2)]),
  city: optionalText(80),
  logoUrl: optionalUrl,
  description: optionalText(2000),
});

export type BrandProfileValues = z.infer<typeof brandProfileSchema>;
