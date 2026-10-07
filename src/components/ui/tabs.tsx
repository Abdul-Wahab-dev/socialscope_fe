'use client';

import { useId, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface TabItem {
  id: string;
  label: ReactNode;
  content: ReactNode;
}

/** Accessible segmented tabs (roving selection with arrow keys). */
export function Tabs({ items, className, listClassName }: { items: TabItem[]; className?: string; listClassName?: string }) {
  const [active, setActive] = useState(items[0]?.id);
  const base = useId();

  return (
    <div className={className}>
      <div
        role="tablist"
        className={cn('inline-flex rounded-2xl bg-zinc-100 p-1 ring-1 ring-zinc-200/70', listClassName)}
        onKeyDown={(e) => {
          const idx = items.findIndex((i) => i.id === active);
          if (e.key === 'ArrowRight') setActive(items[(idx + 1) % items.length]!.id);
          if (e.key === 'ArrowLeft') setActive(items[(idx - 1 + items.length) % items.length]!.id);
        }}
      >
        {items.map((item) => (
          <button
            key={item.id}
            role="tab"
            id={`${base}-tab-${item.id}`}
            aria-selected={active === item.id}
            aria-controls={`${base}-panel-${item.id}`}
            tabIndex={active === item.id ? 0 : -1}
            onClick={() => setActive(item.id)}
            className={cn(
              'rounded-xl px-4 py-2 text-sm font-medium transition-all',
              active === item.id ? 'bg-white text-zinc-950 shadow-soft' : 'text-zinc-600 hover:text-zinc-900',
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      {items.map((item) => (
        <div key={item.id} role="tabpanel" id={`${base}-panel-${item.id}`} aria-labelledby={`${base}-tab-${item.id}`} hidden={active !== item.id} className="animate-fade-up">
          {item.content}
        </div>
      ))}
    </div>
  );
}
