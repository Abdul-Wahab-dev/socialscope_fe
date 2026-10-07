'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApiQuery, useApiMutation, useQueryCache } from '@/lib/query';
import { toast } from 'sonner';
import { Bookmark, BookmarkCheck, Send } from 'lucide-react';
import { queryKeys } from '@/constants/query-keys';
import { routes } from '@/constants/routes';
import { useAuth } from '@/hooks/use-auth';
import { getSavedCreators, saveCreator, unsaveCreator } from '@/services/brand.service';
import type { SocialPlatform } from '@/types/creator';
import { Button, buttonClasses } from '@/components/ui';
import { CollabRequestDialog } from '@/components/collabs/collab-request-dialog';

interface Props {
  creator: { id: string; displayName: string; isAvailable: boolean; isOwnerPreview: boolean; platforms: SocialPlatform[] };
}

export function CreatorActions({ creator }: Props) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const queryCache = useQueryCache();
  const [open, setOpen] = useState(false);
  const isBrand = user?.role === 'brand';

  const saved = useApiQuery({ queryKey: queryKeys.brand.saved, queryFn: getSavedCreators, enabled: isBrand });
  const isSaved = saved.data?.some((s) => s.creatorProfile.id === creator.id) ?? false;

  const toggleSave = useApiMutation({
    mutationFn: () => (isSaved ? unsaveCreator(creator.id) : saveCreator(creator.id)),
    onSuccess: () => {
      toast.success(isSaved ? 'Removed from saved' : 'Saved to your shortlist');
      queryCache.invalidate(queryKeys.brand.saved);
    },
    onError: (e) => toast.error(e.message),
  });

  if (creator.isOwnerPreview) {
    return (
      <Link href={routes.creator.profile} className={buttonClasses('secondary')}>
        Edit profile
      </Link>
    );
  }

  if (!user) {
    return (
      <Link href={`${routes.login}?next=${encodeURIComponent(pathname)}`} className={buttonClasses('primary')}>
        <Send className="h-4 w-4" /> Log in to send a collab request
      </Link>
    );
  }

  if (!isBrand) return null;

  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={() => setOpen(true)} disabled={!creator.isAvailable} title={creator.isAvailable ? undefined : 'This creator is currently booked'}>
        <Send className="h-4 w-4" /> {creator.isAvailable ? 'Send collab request' : 'Currently booked'}
      </Button>
      <Button variant="secondary" loading={toggleSave.isPending} onClick={() => toggleSave.mutate()}>
        {isSaved ? <BookmarkCheck className="h-4 w-4 text-brand-600" /> : <Bookmark className="h-4 w-4" />}
        {isSaved ? 'Saved' : 'Save'}
      </Button>
      <CollabRequestDialog
        open={open}
        onClose={() => {
          setOpen(false);
          router.refresh();
        }}
        creator={{ id: creator.id, displayName: creator.displayName, platforms: creator.platforms }}
      />
    </div>
  );
}
