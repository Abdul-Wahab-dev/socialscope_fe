import { z } from 'zod';

export const optionalUrl = z.union([z.literal(''), z.url('Enter a full URL, e.g. https://…').max(1000)]);
export const optionalText = (max: number) => z.string().trim().max(max, `At most ${max} characters`);
