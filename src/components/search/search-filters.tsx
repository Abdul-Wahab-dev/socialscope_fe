'use client';

import { useState, type FormEvent, type ReactNode } from 'react';
import { RotateCcw, Search } from 'lucide-react';
import type { SearchFilters as Filters } from '@/types/search';
import type { SocialPlatform } from '@/types/creator';
import { COUNTRIES, FOLLOWER_TIERS, LANGUAGES, PLATFORMS } from '@/constants/options';
import { categoryIcon } from '@/constants/category-icons';
import { useCategories } from '@/hooks/use-meta';
import { Button, Input, Select } from '@/components/ui';
import { PlatformBadge } from '@/components/creators/platform-badge';
import { cn } from '@/lib/utils';

interface Props {
  value: Filters;
  onApply: (filters: Filters) => void;
  loading?: boolean;
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="space-y-2.5 border-t border-zinc-100 pt-5">
      <legend className="float-left mb-2.5 w-full text-xs font-semibold tracking-wide text-zinc-500 uppercase">{title}</legend>
      <div className="clear-both space-y-2.5">{children}</div>
    </fieldset>
  );
}

/** Parent passes a `key` derived from the URL so the draft resets on back/forward navigation. */
export function SearchFilters({ value, onApply, loading }: Props) {
  const [draft, setDraft] = useState<Filters>(value);
  const [error, setError] = useState<string | null>(null);
  const { data: categories = [] } = useCategories();

  const set = <K extends keyof Filters>(key: K, v: Filters[K]) => setDraft((d) => ({ ...d, [key]: v }));
  const tierIndex = FOLLOWER_TIERS.findIndex((t) => t.min === draft.minFollowers && t.max === draft.maxFollowers);

  const toggleCategory = (slug: string) => {
    const current = draft.categories ?? [];
    set('categories', current.includes(slug) ? current.filter((c) => c !== slug) : [...current, slug]);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (draft.minEngagement !== undefined && (draft.minEngagement < 0 || draft.minEngagement > 100)) return setError('Engagement must be between 0 and 100');
    if (draft.maxPrice !== undefined && draft.maxPrice < 0) return setError('Max price cannot be negative');
    setError(null);
    onApply({ ...draft, sort: value.sort, page: 1 });
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-5 rounded-3xl bg-white p-5 shadow-soft ring-1 ring-zinc-200/70" noValidate>
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-950">Filters</h2>
        <button type="button" className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-zinc-900" onClick={() => setDraft({})}>
          <RotateCcw className="h-3.5 w-3.5" /> Reset
        </button>
      </div>

      <Input icon={<Search />} aria-label="Keyword" placeholder="Name, bio or city…" value={draft.q ?? ''} maxLength={100} onChange={(e) => set('q', e.target.value || undefined)} />

      <Group title="Niche">
        <div className="flex flex-wrap gap-1.5">
          {categories.map((c) => {
            const active = draft.categories?.includes(c.slug);
            const Icon = categoryIcon(c.slug);
            return (
              <button
                key={c.slug}
                type="button"
                onClick={() => toggleCategory(c.slug)}
                aria-pressed={active}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition',
                  active ? 'bg-brand-600 text-white shadow-soft' : 'bg-zinc-50 text-zinc-700 ring-1 ring-zinc-200 hover:ring-zinc-300',
                )}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden />
                {c.name}
              </button>
            );
          })}
        </div>
      </Group>

      <Group title="Platform">
        <div className="grid grid-cols-2 gap-1.5">
          {[{ value: undefined, label: 'All' }, ...PLATFORMS].map((p) => {
            const active = draft.platform === p.value;
            return (
              <button
                key={p.label}
                type="button"
                aria-pressed={active}
                onClick={() => set('platform', p.value as SocialPlatform | undefined)}
                className={cn(
                  'inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition',
                  active ? 'bg-zinc-950 text-white' : 'bg-zinc-50 text-zinc-700 ring-1 ring-zinc-200 hover:ring-zinc-300',
                )}
              >
                {p.value && <PlatformBadge platform={p.value} size={18} />}
                {p.label}
              </button>
            );
          })}
        </div>
      </Group>

      <Group title="Audience">
        <Select
          aria-label="Audience size"
          value={tierIndex < 0 ? 0 : tierIndex}
          onChange={(e) => {
            const t = FOLLOWER_TIERS[Number(e.target.value)]!;
            setDraft((d) => ({ ...d, minFollowers: t.min, maxFollowers: t.max }));
          }}
        >
          {FOLLOWER_TIERS.map((t, i) => (
            <option key={t.label} value={i}>
              {t.label}
            </option>
          ))}
        </Select>
        <Input
          type="number"
          aria-label="Minimum engagement rate"
          min={0}
          max={100}
          step={0.5}
          placeholder="Min engagement % (e.g. 3)"
          value={draft.minEngagement ?? ''}
          onChange={(e) => set('minEngagement', e.target.value === '' ? undefined : Number(e.target.value))}
        />
        <p className="text-[11px] text-zinc-500">{draft.platform ? 'Applied to the selected platform.' : 'Across all connected platforms.'}</p>
      </Group>

      <Group title="Location & language">
        <Select aria-label="Country" value={draft.country ?? ''} onChange={(e) => set('country', e.target.value || undefined)}>
          <option value="">Any country</option>
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </Select>
        <Input aria-label="City" placeholder="City (e.g. Lahore)" maxLength={80} value={draft.city ?? ''} onChange={(e) => set('city', e.target.value || undefined)} />
        <Select aria-label="Language" value={draft.language ?? ''} onChange={(e) => set('language', e.target.value || undefined)}>
          <option value="">Any language</option>
          {LANGUAGES.map((l) => (
            <option key={l} value={l}>
              {l[0]!.toUpperCase() + l.slice(1)}
            </option>
          ))}
        </Select>
      </Group>

      <Group title="Budget">
        <Input
          type="number"
          aria-label="Max starting price in USD"
          min={0}
          placeholder="Max starting price (USD)"
          value={draft.maxPrice ?? ''}
          onChange={(e) => set('maxPrice', e.target.value === '' ? undefined : Number(e.target.value))}
        />
        <label className="flex cursor-pointer items-center gap-2.5 rounded-xl bg-zinc-50 px-3 py-2.5 text-sm text-zinc-700 ring-1 ring-zinc-200">
          <input type="checkbox" className="h-4 w-4 rounded accent-brand-600" checked={Boolean(draft.availableOnly)} onChange={(e) => set('availableOnly', e.target.checked || undefined)} />
          Only creators open for collabs
        </label>
      </Group>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
      <div className="sticky bottom-0 -mx-5 -mb-5 rounded-b-3xl border-t border-zinc-100 bg-white/95 p-4 backdrop-blur">
        <Button type="submit" variant="gradient" size="lg" loading={loading} className="w-full">
          <Search className="h-4 w-4" /> Search creators
        </Button>
        <p className="mt-2 text-center text-[11px] text-zinc-500">Uses 1 search · paging & sorting are free</p>
      </div>
    </form>
  );
}
