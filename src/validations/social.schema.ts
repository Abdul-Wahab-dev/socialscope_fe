import { z } from "zod";

const MAX = 10_000_000_000;
const FB_HOSTS = /^(www\.|m\.|web\.|mbasic\.)?(facebook|fb)\.com$/i;
const NOT_PROFILES = new Set([
  "groups",
  "events",
  "pages",
  "watch",
  "reel",
  "reels",
  "share",
  "photo",
  "photo.php",
  "videos",
  "posts",
  "permalink.php",
  "story.php",
  "marketplace",
  "hashtag",
  "search",
]);

/** Quick client-side check; the server does the full validation and normalisation. */
export function looksLikeFacebookProfile(raw: string) {
  try {
    const url = new URL(
      /^https?:\/\//i.test(raw.trim()) ? raw.trim() : `https://${raw.trim()}`
    );
    if (!FB_HOSTS.test(url.hostname)) return false;
    const first = url.pathname.split("/").filter(Boolean)[0]?.toLowerCase();
    if (!first || NOT_PROFILES.has(first)) return false;
    if (first === "profile.php")
      return /^\d{5,25}$/.test(url.searchParams.get("id") ?? "");
    return true;
  } catch {
    return false;
  }
}

const required = (label: string) =>
  z
    .number(`Enter ${label}`)
    .int("Use a whole number")
    .min(0, "Can’t be negative")
    .max(MAX, "That looks too high");
const optional = required("a number").optional();

export const selfReportedStatsSchema = z.object({
  profileUrl: z
    .string()
    .trim()
    .min(1, "Add your Facebook profile link")
    .refine(
      looksLikeFacebookProfile,
      "Paste your profile link, e.g. https://www.facebook.com/yourname"
    ),
  followers: required("your followers").min(1, "Enter your followers"),
  avgViews: optional,
  avgLikes: required("average reactions"),
  avgComments: required("average comments"),
  postsCount: optional,
  confirm: z.literal(true, "Please confirm these numbers are accurate"),
});

export type SelfReportedStatsValues = z.infer<typeof selfReportedStatsSchema>;
