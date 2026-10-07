import type { ReactNode } from 'react';
import { AlertCircle, CheckCircle2, Info, Loader2, TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

export function Spinner({ className, label = 'Loading' }: { className?: string; label?: string }) {
  return (
    <div role="status" className={cn('flex items-center justify-center py-10 text-brand-600', className)}>
      <Loader2 className="h-6 w-6 animate-spin" aria-hidden />
      <span className="sr-only">{label}</span>
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn('animate-shimmer rounded-2xl bg-[length:200%_100%]', className)}
      style={{ backgroundImage: 'linear-gradient(90deg, #f1f1f4 0%, #e7e7ec 40%, #f1f1f4 80%)' }}
    />
  );
}

export function EmptyState({ icon, title, description, action, className }: { icon?: ReactNode; title: string; description?: string; action?: ReactNode; className?: string }) {
  return (
    <div className={cn('relative overflow-hidden rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-14 text-center', className)}>
      <div className="bg-dots mask-fade-b pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <div className="relative">
        {icon && (
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-lift ring-1 ring-zinc-200 [&>svg]:h-6 [&>svg]:w-6">
            {icon}
          </div>
        )}
        <h3 className="text-base font-semibold text-zinc-900">{title}</h3>
        {description && <p className="mx-auto mt-1.5 max-w-sm text-sm text-zinc-500">{description}</p>}
        {action && <div className="mt-6 flex justify-center">{action}</div>}
      </div>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center gap-3 rounded-2xl border border-red-200 bg-red-50/60 px-6 py-10 text-center">
      <AlertCircle className="h-7 w-7 text-red-500" aria-hidden />
      <p className="max-w-sm text-sm text-red-800">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

const alertStyles = {
  info: { box: 'border-sky-200 bg-sky-50/70 text-sky-950', icon: Info, iconCls: 'text-sky-600' },
  warning: { box: 'border-amber-200 bg-amber-50/70 text-amber-950', icon: TriangleAlert, iconCls: 'text-amber-600' },
  success: { box: 'border-emerald-200 bg-emerald-50/70 text-emerald-950', icon: CheckCircle2, iconCls: 'text-emerald-600' },
  danger: { box: 'border-red-200 bg-red-50/70 text-red-950', icon: AlertCircle, iconCls: 'text-red-600' },
} as const;

export function Alert({ tone = 'info', title, children, className }: { tone?: keyof typeof alertStyles; title?: string; children?: ReactNode; className?: string }) {
  const s = alertStyles[tone];
  const Icon = s.icon;
  return (
    <div role={tone === 'danger' ? 'alert' : 'status'} className={cn('flex gap-3 rounded-2xl border px-4 py-3.5 text-sm', s.box, className)}>
      <Icon className={cn('mt-0.5 h-[18px] w-[18px] shrink-0', s.iconCls)} aria-hidden />
      <div className="min-w-0 flex-1">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className={cn('opacity-90', title && 'mt-0.5')}>{children}</div>}
      </div>
    </div>
  );
}
