import Link from 'next/link';
import { buttonClasses } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-semibold text-brand-600">404</p>
      <h1 className="mt-2 text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 text-sm text-zinc-500">The page you’re looking for doesn’t exist or has been moved.</p>
      <Link href="/" className={buttonClasses('primary', 'md', 'mt-6')}>
        Go home
      </Link>
    </div>
  );
}
