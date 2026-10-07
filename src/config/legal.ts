import { env } from './env';

/**
 * ⚠️ Fill these in before submitting for platform review. They are rendered on the
 * Privacy Policy, Terms and Data Deletion pages. Override via NEXT_PUBLIC_* env vars.
 */
export const legalConfig = {
  /** Registered business / sole-proprietor name */
  companyName: process.env.NEXT_PUBLIC_LEGAL_COMPANY || `${env.appName}`,
  /** Postal address (required by several app reviews) */
  address: process.env.NEXT_PUBLIC_LEGAL_ADDRESS || '[Street address], Lahore, Punjab, Pakistan',
  privacyEmail: process.env.NEXT_PUBLIC_PRIVACY_EMAIL || 'privacy@socialscope.co',
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@socialscope.co',
  governingLaw: 'the laws of the Islamic Republic of Pakistan',
  courts: process.env.NEXT_PUBLIC_LEGAL_COURTS || 'the courts of Lahore, Pakistan',
  effectiveDate: '28 September 2026',
  minimumAge: 18,
} as const;

export const externalLinks = {
  youtubeTerms: 'https://www.youtube.com/t/terms',
  googlePrivacy: 'https://policies.google.com/privacy',
  googlePermissions: 'https://myaccount.google.com/connections',
  googleSecurityPermissions: 'https://security.google.com/settings/security/permissions',
  metaPlatformTerms: 'https://developers.facebook.com/terms/',
  instagramTerms: 'https://help.instagram.com/581066165581870',
  metaPrivacy: 'https://www.facebook.com/privacy/policy/',
  tiktokTerms: 'https://www.tiktok.com/legal/page/global/terms-of-service/en',
  tiktokPrivacy: 'https://www.tiktok.com/legal/page/row/privacy-policy/en',
  stripePrivacy: 'https://stripe.com/privacy',
} as const;
