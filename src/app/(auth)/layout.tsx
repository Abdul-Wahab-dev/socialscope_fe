import { BadgeCheck, Handshake, LineChart } from 'lucide-react';
import { Logo } from '@/components/layout/logo';

const points = [
  { icon: BadgeCheck, title: 'Verified stats', body: 'Numbers come straight from Instagram, TikTok and YouTube.' },
  { icon: LineChart, title: 'Growth history', body: 'Follower and engagement trends, not a one-off screenshot.' },
  { icon: Handshake, title: 'Paid collabs, organised', body: 'Briefs, counter-offers and chat in one thread.' },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1fr_1.05fr]">
      <div className="flex flex-col px-5 py-8 sm:px-10">
        <Logo />
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="animate-fade-up w-full max-w-[26rem]">{children}</div>
        </div>
      </div>

      <aside className="relative m-3 hidden overflow-hidden rounded-[2rem] bg-ink p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -top-32 -right-32 h-[28rem] w-[28rem] rounded-full bg-accent-500/40 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -bottom-40 -left-24 h-[30rem] w-[30rem] rounded-full bg-brand-600/50 blur-3xl" aria-hidden />
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-[0.07] invert" aria-hidden />

        <p className="relative inline-flex w-fit rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-brand-200 ring-1 ring-white/15">Creator marketplace</p>
        <div className="relative">
          <h2 className="max-w-md text-4xl leading-tight font-semibold tracking-tight">
            Where brands meet creators with <span className="text-gradient">real numbers</span>.
          </h2>
          <ul className="mt-10 space-y-6">
            {points.map(({ icon: Icon, title, body }) => (
              <li key={title} className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                  <Icon className="h-5 w-5 text-brand-200" aria-hidden />
                </span>
                <div>
                  <p className="font-semibold">{title}</p>
                  <p className="text-sm text-zinc-400">{body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-xs text-zinc-500">Free to join · No credit card required for brands</p>
      </aside>
    </div>
  );
}
