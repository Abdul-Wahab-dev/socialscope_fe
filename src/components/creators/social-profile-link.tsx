"use client";

import type { MouseEvent, ReactNode } from "react";
import { openSocialProfile, profileWebUrl } from "@/lib/deep-links";
import type { SocialPlatform } from "@/types/creator";

/** Link to a creator's social profile that opens the native app on mobile. */
export function SocialProfileLink({
  platform,
  handle,
  profileUrl,
  className,
  children,
}: {
  platform: SocialPlatform;
  handle: string;
  profileUrl?: string | null;
  className?: string;
  children: ReactNode;
}) {
  const href = profileWebUrl(platform, handle, profileUrl);
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return; // keep "open in new tab"
    e.preventDefault();
    openSocialProfile(platform, handle, profileUrl);
  };
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={className}
    >
      {children}
    </a>
  );
}
