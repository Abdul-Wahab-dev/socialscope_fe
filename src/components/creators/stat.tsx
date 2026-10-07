import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Stat({ label, value, hint, icon, className }: { label: string; value: ReactNode; hint?: ReactNode; icon?: ReactNode; className?: string }) {
  return (
    <div className={cn('relative overflow-hidden rounded-2xl bg-white p-5 shadow-soft ring-1 ring-zinc-200/70', className)}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-[13px] font-medium text-zinc-500">{label}</p>
        {icon && <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600 [&>svg]:h-4 [&>svg]:w-4">{icon}</span>}
      </div>
      <p className="mt-2 text-[26px] leading-none font-semibold tracking-tight text-zinc-950 tabular-nums">{value}</p>
      {hint && <p className="mt-2 text-xs text-zinc-500">{hint}</p>}
    </div>
  );
}
