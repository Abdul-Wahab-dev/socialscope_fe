import { z } from 'zod';
import { usernameSchema } from './auth.schema';
import { optionalText, optionalUrl } from './common.schema';

export const creatorProfileSchema = z.object({
  username: usernameSchema,
  displayName: z.string().trim().min(2, 'At least 2 characters').max(80),
  bio: optionalText(1000),
  avatarUrl: optionalUrl,
  categories: z.array(z.string()).min(1, 'Pick at least one category').max(5, 'Pick up to 5 categories'),
  languages: z.array(z.string()).max(8, 'Pick up to 8 languages'),
  country: z.string().length(2, 'Select your country'),
  city: optionalText(80),
  contactEmail: z.union([z.literal(''), z.email('Enter a valid email')]),
  isAvailable: z.boolean(),
});

export const rateCardSchema = z.object({
  platform: z.enum(['instagram', 'tiktok', 'youtube']).nullable(),
  deliverable: z.enum(['post', 'reel', 'story', 'video', 'short', 'live', 'ugc', 'other'], 'Choose a deliverable'),
  title: z.string().trim().min(2, 'Give this rate a short title').max(120),
  description: optionalText(1000),
  price: z.number('Enter a price').min(0, 'Price cannot be negative').max(1_000_000, 'That price is too high'),
  currency: z.string().length(3),
});

export const portfolioItemSchema = z.object({
  title: z.string().trim().min(2, 'Add a title').max(120),
  brandName: optionalText(120),
  url: optionalUrl,
  description: optionalText(1000),
});

export type CreatorProfileValues = z.infer<typeof creatorProfileSchema>;
export type RateCardValues = z.infer<typeof rateCardSchema>;
export type PortfolioItemValues = z.infer<typeof portfolioItemSchema>;
