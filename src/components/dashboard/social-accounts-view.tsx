"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useApiQuery, useApiMutation, useQueryCache } from "@/lib/query";
import { toast } from "sonner";
import {
  AlertTriangle,
  Loader2,
  PencilLine,
  RefreshCw,
  Unlink,
} from "lucide-react";
import { PLATFORMS, SELF_REPORTED_PLATFORMS } from "@/constants/options";
import { queryKeys } from "@/constants/query-keys";
import { usePublicConfig } from "@/hooks/use-meta";
import { formatCompact, formatPercent, timeAgo } from "@/lib/utils";
import {
  disconnectSocialAccount,
  getSocialAccounts,
  getSocialConnectUrl,
  syncSocialAccount,
} from "@/services/social.service";
import type { SocialAccount, SocialPlatform } from "@/types/creator";
import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  Dialog,
  ErrorState,
  PageHeader,
  Skeleton,
  buttonClasses,
} from "@/components/ui";
import {
  PlatformBadge,
  platformLabel,
} from "@/components/creators/platform-badge";
import { SelfReportedStatsDialog } from "./self-reported-stats-dialog";

/**
 * Platforms whose mobile app can finish a website login. These get a direct tap-link so
 * the phone can hand the login to the app. Instagram's app can't: it bounces back with a
 * "Complete action using…" chooser, so Instagram's login stays in the browser.
 */
const APP_LOGIN_PLATFORMS = new Set<SocialPlatform>(["tiktok"]);

export function SocialAccountsView() {
  const queryCache = useQueryCache();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const config = usePublicConfig();
  const [connecting, setConnecting] = useState<SocialPlatform | null>(null);
  const [confirmDisconnect, setConfirmDisconnect] =
    useState<SocialAccount | null>(null);
  const [editingStats, setEditingStats] = useState<SocialAccount | null>(null);
  /** Right after a Facebook connect (?connected=facebook) the stats form opens by itself, once */
  const [askStatsFor] = useState(() => {
    const connected = searchParams.get("connected") as SocialPlatform | null;
    return connected && SELF_REPORTED_PLATFORMS.has(connected)
      ? connected
      : null;
  });
  const [autoAskDismissed, setAutoAskDismissed] = useState(false);
  const handled = useRef(false);

  const accounts = useApiQuery({
    queryKey: queryKeys.creator.socials,
    queryFn: getSocialAccounts,
  });

  const invalidateAll = () =>
    Promise.all([
      queryCache.invalidate(queryKeys.creator.socials),
      queryCache.invalidate(queryKeys.creator.me),
      queryCache.invalidate(queryKeys.creator.insights),
    ]);

  // Result of the OAuth round-trip comes back as ?connected=… or ?error=…
  useEffect(() => {
    if (handled.current) return;
    const connected = searchParams.get("connected");
    const error = searchParams.get("error");
    if (!connected && !error) return;
    handled.current = true;
    if (connected) {
      const platform = connected as SocialPlatform;
      if (SELF_REPORTED_PLATFORMS.has(platform)) {
        toast.success(
          `${platformLabel(platform)} profile verified. Now add your stats.`
        );
      } else
        toast.success(`${platformLabel(platform)} connected. Stats imported!`);
      invalidateAll();
    } else if (error) toast.error(error);
    router.replace(pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  /**
   * Pre-fetch each platform's OAuth URL so "Connect" is a plain link the user taps.
   * Mobile OSes only hand a link to an installed app (Universal/App Links) on a direct
   * tap, not after an async API call, so fetching on click always stayed in the browser.
   * The signed `state` inside the URL is valid for 10 minutes; refresh every 8.
   */
  const connectUrls = useApiQuery({
    queryKey: ["social", "connect-urls"],
    queryFn: async () =>
      Object.fromEntries(
        await Promise.all(
          PLATFORMS.map(
            async ({ value }) =>
              [
                value,
                await getSocialConnectUrl(value).catch(() => null),
              ] as const
          )
        )
      ) as Record<SocialPlatform, string | null>,
    staleTime: 8 * 60_000,
    refetchInterval: 8 * 60_000,
  });

  // Fallback when the prepared URL isn't ready yet (or failed): fetch on click as before
  const connect = async (platform: SocialPlatform) => {
    try {
      setConnecting(platform);
      const url = await getSocialConnectUrl(platform);
      window.location.assign(url);
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Could not start connection"
      );
      setConnecting(null);
    }
  };

  const sync = useApiMutation({
    mutationFn: (id: string) => syncSocialAccount(id),
    onSuccess: async () => {
      toast.success("Stats refreshed");
      await invalidateAll();
    },
    onError: (e) => toast.error(e.message),
  });

  const disconnect = useApiMutation({
    mutationFn: (id: string) => disconnectSocialAccount(id),
    onSuccess: async () => {
      toast.success("Account disconnected");
      setConfirmDisconnect(null);
      await invalidateAll();
    },
    onError: (e) => toast.error(e.message),
  });

  if (accounts.isPending) return <Skeleton className="h-96" />;
  if (accounts.isError)
    return (
      <ErrorState
        message={accounts.error.message}
        onRetry={() => accounts.refetch()}
      />
    );

  const byPlatform = new Map(accounts.data.map((a) => [a.platform, a]));
  const justConnected =
    askStatsFor && !autoAskDismissed ? byPlatform.get(askStatsFor) : undefined;
  const statsDialogAccount =
    editingStats ??
    (justConnected && !justConnected.statsReportedAt ? justConnected : null);
  const closeStatsDialog = () => {
    setEditingStats(null);
    setAutoAskDismissed(true);
  };

  return (
    <>
      <PageHeader
        title="Social accounts"
        description="Connect with the official login of each platform. We only read public stats and insights, never post for you."
      />
      {config.data?.socialMode === "mock" && (
        <Alert tone="info" className="mb-4" title="Development mode">
          Social connections are simulated (SOCIAL_OAUTH_MOCK=true), so
          connecting returns demo stats instantly.
        </Alert>
      )}

      <div className="grid gap-4">
        {PLATFORMS.map(({ value: platform, label }) => {
          const account = byPlatform.get(platform);
          return (
            <Card key={platform}>
              <CardBody className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex flex-1 items-center gap-3">
                  <PlatformBadge platform={platform} size={40} />
                  <div className="min-w-0">
                    <p className="font-medium">{label}</p>
                    {account ? (
                      <p className="truncate text-sm text-zinc-500">
                        {account.statsSource === "self_reported" ? (
                          <>
                            {account.handle} ·{" "}
                            {account.statsReportedAt
                              ? `stats updated ${timeAgo(account.statsReportedAt)}`
                              : "profile verified"}
                          </>
                        ) : (
                          <>
                            @{account.handle} · synced{" "}
                            {timeAgo(account.lastSyncedAt)}
                          </>
                        )}
                      </p>
                    ) : (
                      <p className="text-sm text-zinc-500">Not connected</p>
                    )}
                  </div>
                </div>

                {account?.statsSource === "self_reported" &&
                  !account.statsReportedAt && (
                    <p className="text-sm text-amber-700 sm:text-right">
                      Add your stats to show this account on your profile.
                    </p>
                  )}

                {account &&
                  (account.statsSource !== "self_reported" ||
                    account.statsReportedAt) && (
                    <dl className="grid grid-cols-3 gap-4 text-center text-sm">
                      <div>
                        <dt className="text-xs text-zinc-500">Followers</dt>
                        <dd className="font-semibold">
                          {formatCompact(account.followers)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-zinc-500">Engagement</dt>
                        <dd className="font-semibold">
                          {formatPercent(account.engagementRate)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-zinc-500">Avg views</dt>
                        <dd className="font-semibold">
                          {account.avgViews
                            ? formatCompact(account.avgViews)
                            : "—"}
                        </dd>
                      </div>
                    </dl>
                  )}

                <div className="flex gap-2">
                  {account ? (
                    <>
                      {account.statsSource === "self_reported" ? (
                        <Button
                          variant={
                            account.statsReportedAt ? "secondary" : "primary"
                          }
                          size="sm"
                          onClick={() => setEditingStats(account)}
                        >
                          <PencilLine className="h-4 w-4" />{" "}
                          {account.statsReportedAt ? "Edit stats" : "Add stats"}
                        </Button>
                      ) : (
                        <Button
                          variant="secondary"
                          size="sm"
                          loading={
                            sync.isPending && sync.variables === account.id
                          }
                          onClick={() => sync.mutate(account.id)}
                        >
                          <RefreshCw className="h-4 w-4" /> Refresh
                        </Button>
                      )}
                      <Button
                        variant="outlineDanger"
                        size="sm"
                        onClick={() => setConfirmDisconnect(account)}
                        aria-label={`Disconnect ${label}`}
                      >
                        <Unlink className="h-4 w-4" />
                      </Button>
                    </>
                  ) : APP_LOGIN_PLATFORMS.has(platform) &&
                    connectUrls.data?.[platform] ? (
                    <a
                      href={connectUrls.data[platform]!}
                      onClick={() => setConnecting(platform)}
                      className={buttonClasses("primary", "sm")}
                    >
                      {connecting === platform && (
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                      )}
                      Connect {label}
                    </a>
                  ) : (
                    <Button
                      size="sm"
                      loading={connecting === platform}
                      disabled={connecting !== null}
                      onClick={() => connect(platform)}
                    >
                      Connect {label}
                    </Button>
                  )}
                </div>
              </CardBody>
              {account?.syncStatus === "error" && (
                <div className="flex items-center gap-2 border-t border-amber-100 bg-amber-50 px-5 py-2 text-sm text-amber-900">
                  <AlertTriangle className="h-4 w-4" />{" "}
                  {account.syncError ?? "Last sync failed."}
                  <Badge tone="warning" className="ml-auto">
                    Reconnect recommended
                  </Badge>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <p className="mt-4 text-xs text-zinc-500">
        Instagram requires a Professional (Creator or Business) account.
        Facebook login verifies that the profile is yours; Facebook doesn’t
        share profile stats with apps, so you add them yourself and they’re
        shown as “Self-reported”. Other platforms’ stats refresh automatically
        every 12 hours; manual refresh is limited to once per hour. By
        connecting YouTube you agree to the{" "}
        <a
          href="https://www.youtube.com/t/terms"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-700 hover:underline"
        >
          YouTube Terms of Service
        </a>
        . See our{" "}
        <a href="/privacy#platforms" className="text-brand-700 hover:underline">
          Privacy Policy
        </a>{" "}
        for what we read and how to revoke access.
      </p>

      <SelfReportedStatsDialog
        account={statsDialogAccount}
        onClose={closeStatsDialog}
        onSaved={invalidateAll}
      />

      <Dialog
        open={!!confirmDisconnect}
        onClose={() => setConfirmDisconnect(null)}
        title="Disconnect account?"
        description="Its stats will be removed from your public profile and search results."
      >
        <div className="flex justify-end gap-2">
          <Button
            variant="secondary"
            onClick={() => setConfirmDisconnect(null)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            loading={disconnect.isPending}
            onClick={() =>
              confirmDisconnect && disconnect.mutate(confirmDisconnect.id)
            }
          >
            Disconnect
          </Button>
        </div>
      </Dialog>
    </>
  );
}
