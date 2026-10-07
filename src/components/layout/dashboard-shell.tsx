"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApiQuery } from "@/lib/query";
import { ExternalLink, LogOut, Menu, Search, X } from "lucide-react";
import { dashboardNav } from "@/config/site";
import { queryKeys } from "@/constants/query-keys";
import { routes } from "@/constants/routes";
import { useAuth } from "@/hooks/use-auth";
import { getUnreadCount } from "@/services/collab.service";
import { cn } from "@/lib/utils";
import { Avatar, Spinner, buttonClasses } from "@/components/ui";
import { Logo } from "./logo";

export function DashboardShell({ children }: { children: ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: unread = 0 } = useApiQuery({
    queryKey: queryKeys.collabs.unread,
    queryFn: getUnreadCount,
    enabled: Boolean(user),
    refetchInterval: 30_000,
  });

  console.log(user, "dashboard shell is called");
  // Client-side guard (the proxy handles the first request; this covers expired sessions)
  useEffect(() => {
    // if (!isLoading && !user) router.replace(`${routes.login}?next=${encodeURIComponent(pathname)}`);
  }, [isLoading, user, router, pathname]);

  if (isLoading || !user) return <Spinner className="min-h-dvh" />;

  const isBrand = user.role === "brand";
  const nav = isBrand ? dashboardNav.brand : dashboardNav.creator;
  const displayName =
    user.creatorProfile?.displayName ??
    user.brandProfile?.companyName ??
    user.fullName;
  const current =
    nav.find((i) => i.href === pathname) ??
    nav.find((i) => i.href !== nav[0]!.href && pathname.startsWith(i.href));

  const quickAction = isBrand ? (
    <Link href={routes.discover} className={buttonClasses("dark", "sm")}>
      <Search className="h-3.5 w-3.5" /> Find creators
    </Link>
  ) : user.creatorProfile ? (
    <Link
      href={routes.creatorPublic(user.creatorProfile.username)}
      target="_blank"
      className={buttonClasses("secondary", "sm")}
    >
      View media kit <ExternalLink className="h-3.5 w-3.5" />
    </Link>
  ) : null;

  const sidebar = (
    <>
      <div className="px-2">
        <p className="mb-2 px-3 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
          {isBrand ? "Brand workspace" : "Creator studio"}
        </p>
        <nav className="flex flex-col gap-0.5" aria-label="Dashboard">
          {nav.map((item) => {
            const active =
              item.href === pathname ||
              (item.href !== nav[0]!.href && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                  active
                    ? "bg-white text-zinc-950 shadow-soft ring-1 ring-zinc-200/80"
                    : "text-zinc-600 hover:bg-white/70 hover:text-zinc-950"
                )}
              >
                <span
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-lg transition-colors",
                    active
                      ? "bg-brand-gradient text-white shadow-glow"
                      : "bg-zinc-100 text-zinc-500 group-hover:text-zinc-800"
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <span className="flex-1">{item.label}</span>
                {item.href === routes.collabs.root && unread > 0 && (
                  <span className="rounded-full bg-accent-500 px-1.5 py-0.5 text-[10px] leading-none font-semibold text-white">
                    {unread > 99 ? "99+" : unread}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto space-y-3 px-2">
        {!isBrand && user.creatorProfile && !user.creatorProfile.isListed && (
          <Link
            href={routes.creator.root}
            className="bg-brand-gradient block rounded-2xl p-4 text-white shadow-glow"
          >
            <p className="text-sm font-semibold">Go live</p>
            <p className="mt-0.5 text-xs text-white/85">
              Activate your listing so brands can find you.
            </p>
          </Link>
        )}
        <div className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-soft ring-1 ring-zinc-200/70">
          <Avatar
            src={user.creatorProfile?.avatarUrl ?? user.brandProfile?.logoUrl}
            name={displayName}
            size={36}
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-zinc-900">
              {displayName}
            </p>
            <p className="truncate text-xs text-zinc-500">{user.email}</p>
          </div>
          <button
            onClick={logout}
            className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
            aria-label="Log out"
            title="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex min-h-dvh bg-zinc-100/60">
      <aside className="sticky top-0 hidden h-dvh w-[272px] shrink-0 flex-col gap-8 py-5 lg:flex">
        <div className="px-5">
          <Logo href={routes.home} />
        </div>
        {sidebar}
      </aside>

      {/* Mobile top bar + drawer */}
      <div className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b border-zinc-200 bg-white/90 px-4 backdrop-blur lg:hidden">
        <Logo href={routes.home} />
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="rounded-lg p-2 text-zinc-700"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>
      {mobileOpen && (
        <div className="fixed inset-0 top-14 z-20 flex animate-fade-up flex-col gap-6 overflow-y-auto bg-zinc-50 py-5 lg:hidden">
          {sidebar}
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col pt-14 lg:py-3 lg:pt-3 lg:pr-3">
        <main className="min-h-full flex-1 bg-canvas lg:rounded-[1.75rem] lg:shadow-soft lg:ring-1 lg:ring-zinc-200/70">
          <div className="sticky top-14 z-10 hidden items-center justify-between gap-4 rounded-t-[1.75rem] border-b border-zinc-200/70 bg-canvas/85 px-8 py-4 backdrop-blur lg:top-0 lg:flex">
            <p className="text-sm text-zinc-500">
              {isBrand ? "Brand" : "Creator"}{" "}
              <span className="mx-1.5 text-zinc-300">/</span>
              <span className="font-medium text-zinc-900">
                {current?.label ?? "Dashboard"}
              </span>
            </p>
            {quickAction}
          </div>
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8 lg:py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
