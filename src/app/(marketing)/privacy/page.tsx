import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { externalLinks as x, legalConfig as L } from '@/config/legal';
import { ExtLink, LegalPage, type LegalSection } from '@/components/legal/legal-page';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `How ${siteConfig.name} collects, uses and protects your information, including data from Instagram, TikTok and YouTube.`,
};

const APP = siteConfig.name;

const sections: LegalSection[] = [
  {
    id: 'who-we-are',
    title: 'Who we are',
    content: (
      <>
        <p>
          {APP} (“{APP}”, “we”, “us”) is an online marketplace that helps brands discover content creators and send them paid collaboration requests. The service is operated by{' '}
          <strong>{L.companyName}</strong>, {L.address}.
        </p>
        <p>
          This Privacy Policy explains what information we collect when you use our website and apps (the “Service”), how we use it, who we share it with, and the choices you have. If
          you have questions, contact us at <a href={`mailto:${L.privacyEmail}`}>{L.privacyEmail}</a>.
        </p>
      </>
    ),
  },
  {
    id: 'summary',
    title: 'The short version',
    content: (
      <ul>
        <li>We collect the information you give us (account, profile, rates, messages) and, if you are a creator, statistics from social accounts you choose to connect.</li>
        <li>We connect to Instagram, TikTok and YouTube only through their official login and APIs. We never see your social media passwords and we never post, comment or send messages on your behalf.</li>
        <li>Creator profiles you publish, including connected-account statistics, are public so brands can find you.</li>
        <li>We do not sell your personal information and we do not show third-party advertising.</li>
        <li>You can disconnect a social account or delete your whole account at any time from your dashboard. Deletion is immediate.</li>
      </ul>
    ),
  },
  {
    id: 'information-we-collect',
    title: 'Information we collect',
    content: (
      <>
        <h3>a) Information you provide</h3>
        <ul>
          <li>
            <strong>Account information:</strong> name, email address, password (stored only as a salted hash), and whether you are a creator or a brand.
          </li>
          <li>
            <strong>Creator profile:</strong> username, display name, bio, profile picture URL, categories, languages, country and city, availability, business contact email, rate card and
            portfolio items.
          </li>
          <li>
            <strong>Brand profile:</strong> company name, website, industry, location, logo URL and description.
          </li>
          <li>
            <strong>Collaboration content:</strong> campaign briefs, deliverables, budgets, deadlines, counter-offers and the messages exchanged between brands and creators.
          </li>
          <li>
            <strong>Communications</strong> you send to our support team.
          </li>
        </ul>

        <h3>b) Information from social accounts you connect (creators)</h3>
        <p>
          When you choose to connect a social account, you are redirected to that platform’s official login page and asked to grant us specific, read-only permissions. We then receive an
          access token (stored encrypted) and read the following:
        </p>
        <table>
          <thead>
            <tr>
              <th>Platform</th>
              <th>Data we read</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Instagram (Professional accounts)</td>
              <td>Account ID, username, profile picture, follower, following and media counts; like and comment counts and view insights for your recent posts.</td>
            </tr>
            <tr>
              <td>TikTok</td>
              <td>Open ID, username, display name, avatar, profile link, follower, following, likes and video counts; view, like and comment counts for your recent videos.</td>
            </tr>
            <tr>
              <td>YouTube</td>
              <td>Channel ID, channel title, custom URL, thumbnail, subscriber and video counts; view, like and comment counts for your recent uploads.</td>
            </tr>
          </tbody>
        </table>
        <p>
          From this data we calculate aggregate metrics such as average views, average likes, engagement rate and follower growth. We do <strong>not</strong> access your direct messages,
          your password, your contacts, or content that is not listed above, and we never publish anything to your accounts.
        </p>

        <h3>c) Information collected automatically</h3>
        <ul>
          <li>
            <strong>Log and device data:</strong> IP address, browser type, pages requested and timestamps, used for security, rate limiting and troubleshooting.
          </li>
          <li>
            <strong>Search activity:</strong> the filters used in creator searches, together with your account ID or an anonymous visitor ID, used to apply free search limits and to
            improve search results.
          </li>
          <li>
            <strong>Usage counters:</strong> the number of times a creator profile is viewed or appears in search results, shown to that creator as insights.
          </li>
          <li>
            <strong>Cookies:</strong> see section 8.
          </li>
        </ul>

        <h3>d) Payment information</h3>
        <p>
          Payments are processed by Stripe. Your card details are entered on Stripe’s secure checkout and are never sent to or stored on our servers. We receive only the payment status,
          amount, currency and a transaction reference. See the <ExtLink href={x.stripePrivacy}>Stripe Privacy Policy</ExtLink>.
        </p>
      </>
    ),
  },
  {
    id: 'how-we-use',
    title: 'How we use information',
    content: (
      <>
        <ul>
          <li>To create and secure your account and keep you signed in.</li>
          <li>To build and display creator media kits and search results, including statistics from connected social accounts.</li>
          <li>To refresh connected-account statistics automatically (about every 12 hours) and to show follower history.</li>
          <li>To let brands and creators send, negotiate and discuss collaboration requests.</li>
          <li>To process listing fees and search-credit purchases, and to enforce free search limits.</li>
          <li>To prevent fraud, abuse, spam and duplicate or impersonated accounts (for example, one social account may be connected to only one creator).</li>
          <li>To send service messages about your account, requests and payments.</li>
          <li>To comply with legal obligations and enforce our Terms of Service.</li>
        </ul>
        <p>
          Where laws such as the GDPR apply, we rely on: <strong>performance of a contract</strong> (providing the Service you signed up for), <strong>legitimate interests</strong> (security,
          fraud prevention, improving the Service), <strong>consent</strong> (connecting a social account, which you can withdraw at any time), and <strong>legal obligations</strong>.
        </p>
      </>
    ),
  },
  {
    id: 'public-information',
    title: 'What is public',
    content: (
      <>
        <p>
          Once a creator activates their listing, their media kit at <code>/c/username</code> is publicly accessible and appears in search. It shows the display name, username, bio,
          profile picture, categories, languages, city and country, availability, connected-account handles and statistics, rate card and portfolio.
        </p>
        <p>
          Your email address, business contact email, messages, payment history and social access tokens are <strong>never</strong> public. Brand profiles are visible only to creators
          who receive a request from that brand.
        </p>
      </>
    ),
  },
  {
    id: 'sharing',
    title: 'How we share information',
    content: (
      <>
        <p>We do not sell or rent personal information, and we do not share it for cross-context behavioral advertising. We share information only:</p>
        <ul>
          <li>
            <strong>With other users,</strong> as described in “What is public”, and between a brand and a creator taking part in the same collaboration request.
          </li>
          <li>
            <strong>With service providers</strong> who process data on our behalf under confidentiality obligations: cloud hosting and database providers, email delivery, error
            monitoring and Stripe for payments.
          </li>
          <li>
            <strong>With social platforms,</strong> only as needed to call their APIs using the access you granted (Instagram/Meta, TikTok, Google/YouTube).
          </li>
          <li>
            <strong>For legal reasons,</strong> when required by law, court order or to protect the rights, safety and property of our users or the public.
          </li>
          <li>
            <strong>In a business transfer,</strong> such as a merger or acquisition, in which case this policy continues to apply.
          </li>
        </ul>
        <p>No third party serves advertisements on the Service.</p>
      </>
    ),
  },
  {
    id: 'platforms',
    title: 'Instagram, TikTok and YouTube',
    content: (
      <>
        <h3>YouTube API Services</h3>
        <p>
          {APP} uses <strong>YouTube API Services</strong> to read statistics of YouTube channels that creators connect. By connecting a YouTube account you agree to be bound by the{' '}
          <ExtLink href={x.youtubeTerms}>YouTube Terms of Service</ExtLink>. Google’s handling of your information is described in the{' '}
          <ExtLink href={x.googlePrivacy}>Google Privacy Policy</ExtLink>.
        </p>
        <p>
          You can revoke {APP}’s access to your YouTube/Google data at any time via the{' '}
          <ExtLink href={x.googleSecurityPermissions}>Google security settings page</ExtLink>, or by disconnecting YouTube in your {APP} dashboard. When you revoke access, disconnect or
          ask us to delete your data, we delete the YouTube data we store within 7 days of a deletion request, and in any case within 30 days of access being revoked. Stored YouTube data
          that we can no longer refresh is deleted automatically after 30 days.
        </p>

        <h3>Instagram (Meta)</h3>
        <p>
          Instagram data is accessed through Meta’s official Instagram API and is subject to the <ExtLink href={x.metaPlatformTerms}>Meta Platform Terms</ExtLink> and{' '}
          <ExtLink href={x.metaPrivacy}>Meta Privacy Policy</ExtLink>. You can remove {APP}’s access in the Instagram app under{' '}
          <em>Settings → Security → Apps and websites</em>, or disconnect Instagram in your dashboard. If you remove the app on Instagram, Meta notifies us and we delete your Instagram
          data automatically. See our <Link href="/data-deletion">Data Deletion page</Link>.
        </p>

        <h3>TikTok</h3>
        <p>
          TikTok data is accessed through TikTok’s Login Kit and Display API and is subject to the <ExtLink href={x.tiktokTerms}>TikTok Terms of Service</ExtLink> and{' '}
          <ExtLink href={x.tiktokPrivacy}>TikTok Privacy Policy</ExtLink>. You can remove access in the TikTok app under <em>Settings and privacy → Security → Apps and services</em>, or
          disconnect TikTok in your dashboard.
        </p>
        <p className="callout">
          {APP} is an independent service and is not affiliated with, endorsed or sponsored by Meta, Instagram, TikTok, Google or YouTube.
        </p>
      </>
    ),
  },
  {
    id: 'cookies',
    title: 'Cookies',
    content: (
      <>
        <p>We use a small number of cookies that are strictly necessary for the Service to work. We do not use advertising or cross-site tracking cookies.</p>
        <table>
          <thead>
            <tr>
              <th>Cookie</th>
              <th>Purpose</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>ss_access</code>
              </td>
              <td>Keeps you signed in (signed access token that expires after 15 minutes and is renewed automatically; HTTP-only)</td>
              <td>30 days</td>
            </tr>
            <tr>
              <td>
                <code>ss_refresh</code>
              </td>
              <td>Renews your session securely (HTTP-only, sent only to authentication endpoints)</td>
              <td>30 days</td>
            </tr>
            <tr>
              <td>
                <code>ss_session</code>
              </td>
              <td>Remembers whether you are signed in as a creator or brand, to route you to the right dashboard (contains no personal data)</td>
              <td>30 days</td>
            </tr>
            <tr>
              <td>
                <code>ss_guest</code>
              </td>
              <td>Anonymous random ID used to apply the free guest search limit</td>
              <td>12 months</td>
            </tr>
          </tbody>
        </table>
        <p>You can block cookies in your browser settings, but you will not be able to sign in without them.</p>
      </>
    ),
  },
  {
    id: 'retention',
    title: 'How long we keep information',
    content: (
      <ul>
        <li>
          <strong>Account and profile data:</strong> for as long as your account exists. When you delete your account, it is erased immediately together with your profiles, connected
          accounts, statistics history, rate cards, portfolio, collaboration requests and messages.
        </li>
        <li>
          <strong>Connected-account data:</strong> refreshed about every 12 hours while connected. Deleted immediately when you disconnect the account, and automatically if it cannot be
          refreshed for 30 days (for example, because you revoked access).
        </li>
        <li>
          <strong>Search logs:</strong> up to 12 months.
        </li>
        <li>
          <strong>Payment records:</strong> transaction records held by Stripe are retained by Stripe as required by financial regulations.
        </li>
        <li>
          <strong>Deletion confirmations:</strong> a confirmation code and date (no personal content) to prove a deletion request was honored.
        </li>
        <li>
          <strong>Backups:</strong> deleted data may persist in encrypted backups for up to 30 days before being overwritten.
        </li>
      </ul>
    ),
  },
  {
    id: 'your-rights',
    title: 'Your rights and choices',
    content: (
      <>
        <p>Depending on where you live, you may have the right to access, correct, delete, export or restrict the use of your personal information, and to object to certain processing.</p>
        <ul>
          <li>
            <strong>Access and correct:</strong> edit your profile, rates and portfolio at any time from your dashboard.
          </li>
          <li>
            <strong>Disconnect:</strong> remove any connected social account from <em>Dashboard → Social accounts</em>. Its data is deleted immediately.
          </li>
          <li>
            <strong>Delete:</strong> delete your account from <em>Dashboard → Settings → Delete account</em>, or follow the steps on our <Link href="/data-deletion">Data Deletion page</Link>.
          </li>
          <li>
            <strong>Export or other requests:</strong> email <a href={`mailto:${L.privacyEmail}`}>{L.privacyEmail}</a>. We respond within 30 days and may need to verify your identity.
          </li>
          <li>
            <strong>Complaints:</strong> you can contact your local data protection authority.
          </li>
        </ul>
        <p>We will not discriminate against you for exercising any of these rights.</p>
      </>
    ),
  },
  {
    id: 'security',
    title: 'Security',
    content: (
      <p>
        We protect information with industry-standard measures: all traffic is encrypted with HTTPS, passwords are hashed with bcrypt, social access tokens are encrypted at rest with
        AES-256-GCM and are never exposed to browsers, sessions use HTTP-only cookies with rotating refresh tokens, and access to production systems is restricted. No method of
        transmission or storage is 100% secure, so we cannot guarantee absolute security. We will notify you and the relevant authorities of a data breach where required by law.
      </p>
    ),
  },
  {
    id: 'international',
    title: 'International transfers',
    content: (
      <p>
        We and our service providers may process information in countries other than the one you live in, including Pakistan, the United States and the European Union. Where required, we
        use appropriate safeguards such as standard contractual clauses.
      </p>
    ),
  },
  {
    id: 'children',
    title: 'Children',
    content: (
      <p>
        The Service is intended for users who are at least {L.minimumAge} years old (or the age of majority where they live). We do not knowingly collect information from children. If you
        believe a child has created an account, contact us and we will delete it.
      </p>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to this policy',
    content: (
      <p>
        We may update this policy as the Service changes. We will post the new version here with a new effective date, and notify you by email or in the app if the changes are material.
      </p>
    ),
  },
  {
    id: 'contact',
    title: 'Contact us',
    content: (
      <p>
        {L.companyName}
        <br />
        {L.address}
        <br />
        Privacy questions or complaints: <a href={`mailto:${L.privacyEmail}`}>{L.privacyEmail}</a>
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      current="/privacy"
      title="Privacy Policy"
      updated={L.effectiveDate}
      intro={<p>We built {APP} to show verified creator statistics without ever asking for passwords or screenshots. Here is exactly what we collect, why, and how you stay in control.</p>}
      sections={sections}
    />
  );
}
