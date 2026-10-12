import type { SocialPlatform } from "@/types/creator";

type MobileOS = "ios" | "android" | null;

export function getMobileOS(): MobileOS {
  if (typeof navigator === "undefined") return null;
  const ua = navigator.userAgent || "";
  if (/android/i.test(ua)) return "android";
  // iPadOS 13+ reports itself as "Macintosh" but has touch
  if (
    /iPad|iPhone|iPod/.test(ua) ||
    (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)
  )
    return "ios";
  return null;
}

const ANDROID_PACKAGES: Record<SocialPlatform, string> = {
  instagram: "com.instagram.android",
  tiktok: "com.zhiliaoapp.musically",
  youtube: "com.google.android.youtube",
};

/** Web profile URL used as the fallback everywhere. */
export function profileWebUrl(
  platform: SocialPlatform,
  handle: string,
  profileUrl?: string | null
): string {
  if (profileUrl) return profileUrl;
  const h = handle.replace(/^@/, "");
  if (platform === "instagram") return `https://www.instagram.com/${h}/`;
  if (platform === "tiktok") return `https://www.tiktok.com/@${h}`;
  return `https://www.youtube.com/@${h}`;
}

/**
 * Opens a creator's profile in the native app on phones, falling back to the website.
 * - Android: intent:// URL with the app's package; Chrome opens the app, or
 *   browser_fallback_url when it isn't installed.
 * - iOS: Instagram/YouTube custom schemes with a timed fallback to the web URL;
 *   TikTok uses its https universal link (opens the app when installed).
 * - Desktop: a normal new tab.
 */
export function openSocialProfile(
  platform: SocialPlatform,
  handle: string,
  profileUrl?: string | null
): void {
  const web = profileWebUrl(platform, handle, profileUrl);
  const os = getMobileOS();
  const h = handle.replace(/^@/, "");

  if (os === "android") {
    const u = new URL(web);
    const intent =
      `intent://${u.host}${u.pathname}${u.search}#Intent;scheme=https;package=${ANDROID_PACKAGES[platform]};` +
      `S.browser_fallback_url=${encodeURIComponent(web)};end`;
    window.location.href = intent;
    return;
  }

  if (os === "ios") {
    const scheme =
      platform === "instagram"
        ? `instagram://user?username=${encodeURIComponent(h)}`
        : platform === "youtube"
          ? `youtube://${web.replace(/^https?:\/\//, "")}`
          : null; // TikTok: universal link is the reliable route

    if (!scheme) {
      window.location.href = web;
      return;
    }
    // If the app opens, the page gets hidden and we cancel the fallback.
    const fallback = window.setTimeout(() => {
      if (document.visibilityState === "visible") window.location.href = web;
    }, 1200);
    const cancel = () => {
      if (document.visibilityState === "hidden") window.clearTimeout(fallback);
    };
    document.addEventListener("visibilitychange", cancel, { once: true });
    window.location.href = scheme;
    return;
  }

  window.open(web, "_blank", "noopener,noreferrer");
}
