import { z } from 'zod';

const today = () => new Date().toISOString().slice(0, 10);

export const collabRequestSchema = z.object({
  title: z.string().trim().min(5, 'At least 5 characters').max(150),
  brief: z.string().trim().min(20, 'Describe the campaign in at least 20 characters').max(5000),
  deliverables: z
    .array(
      z.object({
        platform: z.enum(['instagram', 'tiktok', 'youtube']).optional(),
        type: z.enum(['post', 'reel', 'story', 'video', 'short', 'live', 'ugc', 'other']),
        quantity: z.number('Enter a quantity').int().min(1, 'Min 1').max(100, 'Max 100'),
      }),
    )
    .min(1, 'Add at least one deliverable')
    .max(10),
  budget: z.number('Enter your budget').min(1, 'Budget must be at least 1').max(1_000_000),
  currency: z.string().length(3),
  deadline: z.union([z.literal(''), z.iso.date().refine((d) => d >= today(), 'Deadline cannot be in the past')]).optional(),
});

export const respondCollabSchema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('accept'), message: z.string().trim().max(2000).optional() }),
  z.object({ action: z.literal('decline'), message: z.string().trim().max(2000).optional() }),
  z.object({ action: z.literal('counter'), counterBudget: z.number('Enter an amount').min(1), message: z.string().trim().max(2000).optional() }),
]);

export const messageSchema = z.object({ body: z.string().trim().min(1, 'Write a message').max(4000, 'Message is too long') });

export type CollabRequestValues = z.infer<typeof collabRequestSchema>;
export type RespondCollabValues = z.infer<typeof respondCollabSchema>;
export type MessageValues = z.infer<typeof messageSchema>;
