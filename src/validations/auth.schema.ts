import { z } from 'zod';

export const passwordSchema = z
  .string()
  .min(8, 'At least 8 characters')
  .max(72, 'At most 72 characters')
  .regex(/[a-z]/, 'Add a lowercase letter')
  .regex(/[A-Z]/, 'Add an uppercase letter')
  .regex(/[0-9]/, 'Add a number');

export const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, 'At least 3 characters')
  .max(30, 'At most 30 characters')
  .regex(/^[a-z0-9_.]+$/, 'Only letters, numbers, dot and underscore')
  .refine((v) => !/^[._]|[._]$/.test(v), 'Cannot start or end with . or _');

export const loginSchema = z.object({
  email: z.email('Enter a valid email').trim().toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z
  .object({
    role: z.enum(['creator', 'brand']),
    fullName: z.string().trim().min(2, 'Enter your full name').max(120),
    email: z.email('Enter a valid email').trim().toLowerCase(),
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirm your password'),
    username: z.string().trim().toLowerCase().optional(),
    companyName: z.string().trim().optional(),
    acceptTerms: z.boolean().refine((v) => v, 'You must accept the terms'),
  })
  .superRefine((d, ctx) => {
    if (d.password !== d.confirmPassword) ctx.addIssue({ code: 'custom', path: ['confirmPassword'], message: 'Passwords do not match' });
    if (d.role === 'creator') {
      const res = usernameSchema.safeParse(d.username ?? '');
      if (!res.success) ctx.addIssue({ code: 'custom', path: ['username'], message: res.error.issues[0]?.message ?? 'Invalid username' });
    }
    if (d.role === 'brand' && (!d.companyName || d.companyName.length < 2)) {
      ctx.addIssue({ code: 'custom', path: ['companyName'], message: 'Enter your company or brand name' });
    }
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Enter your current password'),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirm your new password'),
  })
  .refine((d) => d.newPassword === d.confirmPassword, { path: ['confirmPassword'], message: 'Passwords do not match' })
  .refine((d) => d.newPassword !== d.currentPassword, { path: ['newPassword'], message: 'Use a different password' });

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

/** Shape the API expects (discriminated by role). */
export type RegisterPayload =
  | { role: 'creator'; email: string; password: string; fullName: string; username: string }
  | { role: 'brand'; email: string; password: string; fullName: string; companyName: string };

export function toRegisterPayload(v: RegisterValues): RegisterPayload {
  const base = { email: v.email, password: v.password, fullName: v.fullName };
  return v.role === 'creator' ? { ...base, role: 'creator', username: v.username ?? '' } : { ...base, role: 'brand', companyName: v.companyName ?? '' };
}
