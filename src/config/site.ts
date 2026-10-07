import type { LucideIcon } from 'lucide-react';
import { BarChart3, Bookmark, CreditCard, Handshake, LayoutDashboard, Link2, Search, Settings, Tags, UserRound, Images } from 'lucide-react';
import { routes } from '@/constants/routes';
import type { UserRole } from '@/types/user';
import { env } from './env';

export const siteConfig = {
  name: env.appName,
  description: 'Find verified content creators for paid collaborations — real stats from connected Instagram, TikTok and YouTube accounts.',
};

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const dashboardNav: Record<Exclude<UserRole, 'admin'>, NavItem[]> = {
  creator: [
    { label: 'Overview', href: routes.creator.root, icon: LayoutDashboard },
    { label: 'Profile', href: routes.creator.profile, icon: UserRound },
    { label: 'Social accounts', href: routes.creator.socials, icon: Link2 },
    { label: 'Rate card', href: routes.creator.rates, icon: Tags },
    { label: 'Portfolio', href: routes.creator.portfolio, icon: Images },
    { label: 'Collab requests', href: routes.collabs.root, icon: Handshake },
    { label: 'Settings', href: routes.settings, icon: Settings },
  ],
  brand: [
    { label: 'Overview', href: routes.brand.root, icon: BarChart3 },
    { label: 'Find creators', href: routes.discover, icon: Search },
    { label: 'Saved creators', href: routes.brand.saved, icon: Bookmark },
    { label: 'Collaborations', href: routes.collabs.root, icon: Handshake },
    { label: 'Company profile', href: routes.brand.profile, icon: UserRound },
    { label: 'Billing', href: routes.brand.billing, icon: CreditCard },
    { label: 'Settings', href: routes.settings, icon: Settings },
  ],
};
