import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { siteConfig } from '@/config/site';
import { externalLinks as x, legalConfig as L } from '@/config/legal';
import { ExtLink, LegalPage, type LegalSection } from '@/components/legal/legal-page';
import { DeletionStatusLookup } from '@/components/legal/deletion-status-lookup';

export const metadata: Metadata = {
  title: 'Data Deletion',
  description: `How to delete your ${siteConfig.name} account and the data we hold from Instagram, TikTok and YouTube.`,
};

const APP = siteConfig.name;

const sections: LegalSection[] = [
  {
    id: 'delete-account',
    title: 'Delete your whole account',
    content: (
      <>
        <ol>
          <li>
            <Link href="/login">Log in</Link> to {APP}.
          </li>
          <li>
            Go to <strong>Dashboard → Settings</strong>.
          </li>
          <li>
            Under <strong>Delete account</strong>, enter your password, type <code>DELETE</code> and confirm.
          </li>
        </ol>
        <p>
          Deletion is <strong>immediate and permanent</strong>. It removes your account, creator or brand profile, connected social accounts and their access tokens, statistics history,
          rate card, portfolio, saved creators, collaboration requests and messages. You will be shown a confirmation code.
        </p>
      </>
    ),
  },
  {
    id: 'disconnect',
    title: 'Remove data from one social account',
    content: (
      <>
        <p>
          In <strong>Dashboard → Social accounts</strong>, click the disconnect button next to Instagram, TikTok or YouTube. We immediately delete that account’s access token, statistics
          and history. The rest of your profile stays.
        </p>
        <p>You can also revoke our access directly on each platform. We delete the related data automatically:</p>
        <ul>
          <li>
            <strong>Instagram:</strong> Instagram app → Settings → Security → <em>Apps and websites</em> → remove {APP}. Meta sends us a deletion request and we erase your Instagram
            data right away. You can track it with the confirmation code below.
          </li>
          <li>
            <strong>YouTube / Google:</strong> remove {APP} on the <ExtLink href={x.googleSecurityPermissions}>Google security settings page</ExtLink>. Data we can no longer refresh
            is deleted within 30 days.
          </li>
          <li>
            <strong>TikTok:</strong> TikTok app → Settings and privacy → Security → <em>Apps and services</em> → remove {APP}. Data we can no longer refresh is deleted within 30 days.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'by-email',
    title: 'Request deletion by email',
    content: (
      <p>
        If you can’t log in, email <a href={`mailto:${L.privacyEmail}?subject=Data%20deletion%20request`}>{L.privacyEmail}</a> from the address on your account with the subject “Data
        deletion request”. We may ask you to verify your identity, and we will complete the request within 7 days.
      </p>
    ),
  },
  {
    id: 'status',
    title: 'Check a deletion request',
    content: (
      <>
        <p>Enter the confirmation code you received from {APP} or from Meta to see the status of your request.</p>
        <Suspense>
          <DeletionStatusLookup />
        </Suspense>
      </>
    ),
  },
  {
    id: 'what-we-keep',
    title: 'What we may keep',
    content: (
      <ul>
        <li>A confirmation code and date proving the deletion took place (no personal content).</li>
        <li>Payment records held by our payment processor, Stripe, as required by financial regulations.</li>
        <li>Encrypted backups, which are overwritten within 30 days.</li>
        <li>Messages you sent to other users may remain in copies those users already received, such as email notifications.</li>
      </ul>
    ),
  },
];

export default function DataDeletionPage() {
  return (
    <LegalPage
      current="/data-deletion"
      title="Data Deletion Instructions"
      updated={L.effectiveDate}
      intro={
        <p>
          You are always in control of your data. Here’s how to delete your {APP} account or just the data from a connected Instagram, TikTok or YouTube account. See our{' '}
          <Link href="/privacy" className="font-medium text-brand-700 underline underline-offset-2">
            Privacy Policy
          </Link>{' '}
          for details.
        </p>
      }
      sections={sections}
    />
  );
}
