import Link from 'next/link';
import { buttonClasses } from '@/components/ui/button';
import { routes } from '@/constants/routes';

export default function CreatorNotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="text-xl font-semibold">Creator not found</h1>
      <p className="mt-2 text-sm text-zinc-500">This profile doesn’t exist or isn’t public yet.</p>
      <Link href={routes.discover} className={buttonClasses('primary', 'md', 'mt-6')}>
        Browse creators
      </Link>
    </div>
  );
}
