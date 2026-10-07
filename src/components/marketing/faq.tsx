import { Plus } from 'lucide-react';

export interface FaqItem {
  q: string;
  a: string;
}

/** Native <details> accordion: accessible and works without JavaScript. */
export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-zinc-200 rounded-3xl bg-white px-6 shadow-soft ring-1 ring-zinc-200/70 sm:px-8">
      {items.map((item) => (
        <details key={item.q} className="group py-5 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left text-[15px] font-medium text-zinc-950">
            {item.q}
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 transition group-open:rotate-45 group-open:bg-brand-600 group-open:text-white">
              <Plus className="h-4 w-4" aria-hidden />
            </span>
          </summary>
          <p className="mt-3 pr-12 text-sm leading-relaxed text-zinc-600">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
