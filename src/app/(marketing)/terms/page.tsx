import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { externalLinks as x, legalConfig as L } from '@/config/legal';
import { ExtLink, LegalPage, type LegalSection } from '@/components/legal/legal-page';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: `The terms that govern your use of ${siteConfig.name}.`,
};

const APP = siteConfig.name;

const sections: LegalSection[] = [
  {
    id: 'acceptance',
    title: 'Agreement to these terms',
    content: (
      <>
        <p>
          These Terms of Service (“Terms”) are a binding agreement between you and <strong>{L.companyName}</strong> (“{APP}”, “we”, “us”) governing your use of the {APP} website, apps and
          related services (the “Service”). By creating an account or using the Service you agree to these Terms and to our <Link href="/privacy">Privacy Policy</Link>. If you do not
          agree, do not use the Service.
        </p>
        <p>If you use the Service on behalf of a company, you confirm that you are authorised to accept these Terms for it, and “you” includes that company.</p>
      </>
    ),
  },
  {
    id: 'service',
    title: 'What the Service is',
    content: (
      <>
        <p>
          {APP} is a marketplace where <strong>creators</strong> publish profiles (“media kits”) with statistics from social accounts they connect, and <strong>brands</strong> search
          those profiles and send collaboration requests. We provide tools for discovery, messaging and negotiation.
        </p>
        <p>
          We are <strong>not</strong> a talent agency, employer or party to any agreement between a brand and a creator, and we do not guarantee that any collaboration will happen, be
          completed or be paid. Unless we expressly offer a payment-protection feature in the future, all payments for collaborations are made directly between brands and creators.
        </p>
      </>
    ),
  },
  {
    id: 'accounts',
    title: 'Eligibility and accounts',
    content: (
      <ul>
        <li>You must be at least {L.minimumAge} years old (or the age of majority where you live) and able to enter into a binding contract.</li>
        <li>You must provide accurate information and keep it up to date. One person or business may not maintain multiple accounts to evade limits or suspensions.</li>
        <li>You are responsible for keeping your password confidential and for all activity under your account. Tell us immediately about any unauthorised use.</li>
      </ul>
    ),
  },
  {
    id: 'creators',
    title: 'Creator responsibilities',
    content: (
      <ul>
        <li>You may connect only social accounts that you own or are authorised to manage. Connecting someone else’s account is prohibited.</li>
        <li>Your profile, rates and portfolio must be accurate and must not be misleading. You must not artificially inflate followers, views or engagement (for example, by buying them).</li>
        <li>
          When you publish sponsored content, you are responsible for clearly disclosing it (e.g. “#ad” or the platform’s paid-partnership label) as required by law and by each platform’s
          rules.
        </li>
        <li>You are responsible for delivering what you agree to with a brand and for your own taxes on income you earn.</li>
      </ul>
    ),
  },
  {
    id: 'brands',
    title: 'Brand responsibilities',
    content: (
      <ul>
        <li>Collaboration requests must be genuine, describe the campaign accurately, and concern lawful products and services.</li>
        <li>You must pay creators what you agree to, on the agreed terms, and respect their intellectual property and usage-rights terms.</li>
        <li>You may use creator information obtained through the Service only to evaluate and contact creators for collaborations, not to build databases, resell data or send spam.</li>
      </ul>
    ),
  },
  {
    id: 'fees',
    title: 'Fees and payments',
    content: (
      <>
        <ul>
          <li>
            <strong>Creator listing fee:</strong> creators pay a one-time fee to publish their profile in search, as shown at checkout. We may offer free listings (such as a “Founding
            creator” promotion) at our discretion.
          </li>
          <li>
            <strong>Searches:</strong> visitors get a limited number of free searches; registered users receive a free weekly allowance. Additional searches are available as prepaid
            search packs. Credits do not expire but are non-transferable and have no cash value.
          </li>
          <li>Payments are processed by Stripe. Prices are shown before you pay and may include applicable taxes. We may change prices for future purchases with notice.</li>
          <li>
            Except where required by law or where we fail to provide what you paid for, fees are <strong>non-refundable</strong>. If you believe you were charged in error, contact{' '}
            <a href={`mailto:${L.supportEmail}`}>{L.supportEmail}</a> within 30 days.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'third-party-platforms',
    title: 'Third-party platforms',
    content: (
      <>
        <p>The Service integrates with Instagram, TikTok and YouTube. When you connect one of these accounts:</p>
        <ul>
          <li>
            <strong>YouTube:</strong> {APP} uses YouTube API Services. By connecting a YouTube account you agree to be bound by the{' '}
            <ExtLink href={x.youtubeTerms}>YouTube Terms of Service</ExtLink>, and Google’s use of your data is governed by the <ExtLink href={x.googlePrivacy}>Google Privacy Policy</ExtLink>.
          </li>
          <li>
            <strong>Instagram:</strong> your use of Instagram remains subject to the <ExtLink href={x.instagramTerms}>Instagram Terms of Use</ExtLink>.
          </li>
          <li>
            <strong>TikTok:</strong> your use of TikTok remains subject to the <ExtLink href={x.tiktokTerms}>TikTok Terms of Service</ExtLink>.
          </li>
        </ul>
        <p>
          We are not affiliated with, endorsed or sponsored by Meta, Instagram, TikTok, Google or YouTube, and we are not responsible for their services, availability or any changes to
          their APIs that affect the Service.
        </p>
      </>
    ),
  },
  {
    id: 'acceptable-use',
    title: 'Acceptable use',
    content: (
      <>
        <p>You agree not to:</p>
        <ul>
          <li>scrape, crawl or bulk-download data from the Service, or use bots to access it;</li>
          <li>circumvent search limits, payments or security measures, or create accounts to do so;</li>
          <li>impersonate any person or brand, or misrepresent your affiliation;</li>
          <li>post content that is unlawful, fraudulent, harassing, hateful, sexually explicit, or that infringes others’ rights;</li>
          <li>use the Service to send spam or unsolicited promotions, or to promote illegal products or services;</li>
          <li>attempt to access other users’ accounts or data, or interfere with the Service’s operation;</li>
          <li>reverse engineer the Service except where the law allows it.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'content',
    title: 'Your content',
    content: (
      <p>
        You keep ownership of the content you submit (profiles, bios, portfolio items, briefs and messages). You grant us a worldwide, non-exclusive, royalty-free licence to host, store,
        display and reproduce that content solely to operate, promote and improve the Service. This licence ends when you delete the content or your account, except for copies other
        users already received (such as messages) and backups kept for a limited period.
      </p>
    ),
  },
  {
    id: 'statistics',
    title: 'Statistics and availability',
    content: (
      <p>
        Statistics are provided by third-party platforms and calculated by us. They may be delayed, incomplete or inaccurate, and we do not guarantee them. You should use your own judgment
        before entering into a collaboration. We aim to keep the Service available but do not guarantee it will be uninterrupted or error-free, and we may change or discontinue features.
      </p>
    ),
  },
  {
    id: 'termination',
    title: 'Suspension and termination',
    content: (
      <p>
        You can delete your account at any time from your settings. We may suspend or terminate your account, remove content or refuse service if you breach these Terms, create risk or
        legal exposure for us or other users, or if required by law or a platform partner. Where reasonable we will tell you why. Fees already paid are not refunded when an account is
        terminated for breach.
      </p>
    ),
  },
  {
    id: 'disclaimers',
    title: 'Disclaimers',
    content: (
      <p>
        The Service is provided <strong>“as is” and “as available”</strong>. To the fullest extent permitted by law, we disclaim all warranties, express or implied, including
        merchantability, fitness for a particular purpose and non-infringement. We are not responsible for the conduct of users, the quality of creator content, or payments between
        brands and creators.
      </p>
    ),
  },
  {
    id: 'liability',
    title: 'Limitation of liability',
    content: (
      <p>
        To the fullest extent permitted by law, {L.companyName} will not be liable for any indirect, incidental, special, consequential or punitive damages, or for lost profits, revenue,
        data or goodwill. Our total liability for any claim relating to the Service is limited to the greater of (a) the amounts you paid us in the 12 months before the claim or (b) USD
        100. Nothing in these Terms limits liability that cannot be limited by law.
      </p>
    ),
  },
  {
    id: 'indemnity',
    title: 'Indemnity',
    content: (
      <p>
        You agree to indemnify and hold harmless {L.companyName} from claims, losses and expenses (including reasonable legal fees) arising from your content, your collaborations with
        other users, or your breach of these Terms or of any law or third-party right.
      </p>
    ),
  },
  {
    id: 'law',
    title: 'Governing law and disputes',
    content: (
      <p>
        These Terms are governed by {L.governingLaw}, without regard to conflict-of-law rules. Disputes will be resolved exclusively by {L.courts}, unless mandatory consumer-protection
        laws where you live give you the right to bring proceedings locally. Before starting proceedings, please contact us so we can try to resolve the issue informally.
      </p>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to these terms',
    content: (
      <p>
        We may update these Terms from time to time. We will post the updated version with a new effective date and, for material changes, notify you by email or in the app at least 14
        days before they take effect. Continuing to use the Service after that means you accept the new Terms.
      </p>
    ),
  },
  {
    id: 'contact',
    title: 'Contact',
    content: (
      <p>
        {L.companyName}
        <br />
        {L.address}
        <br />
        <a href={`mailto:${L.supportEmail}`}>{L.supportEmail}</a>
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      current="/terms"
      title="Terms of Service"
      updated={L.effectiveDate}
      intro={<p>Please read these terms carefully. They explain your rights and responsibilities as a creator or brand on {APP}.</p>}
      sections={sections}
    />
  );
}
