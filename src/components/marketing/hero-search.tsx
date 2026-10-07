'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { routes } from '@/constants/routes';
import type { Category } from '@/types/creator';

/** Quick search that hands off to /discover (the real search, which applies quota). */
export function HeroSearch({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({ sort: 'relevance' });
    if (q.trim()) params.set('q', q.trim().slice(0, 100));
    if (category) params.set('categories', category);
    router.push(`${routes.discover}?${params.toString()}`);
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-2 rounded-2xl bg-white p-2 shadow-lift ring-1 ring-zinc-200/80 sm:flex-row sm:items-center" role="search">
      <label className="flex flex-1 items-center gap-2.5 px-3">
        <Search className="h-5 w-5 shrink-0 text-zinc-400" aria-hidden />
        <span className="sr-only">Search creators</span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          maxLength={100}
          placeholder="Try “skincare”, “Lahore” or a creator name"
          className="h-11 w-full bg-transparent text-[15px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
        />
      </label>
      <div className="flex gap-2">
        <label className="sr-only" htmlFor="hero-category">
          Category
        </label>
        <select
          id="hero-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-11 min-w-0 flex-1 rounded-xl bg-zinc-50 px-3 text-sm text-zinc-700 ring-1 ring-zinc-200 ring-inset focus:ring-2 focus:ring-brand-500 focus:outline-none sm:w-44 sm:flex-none"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <button type="submit" className="bg-brand-gradient inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold text-white shadow-glow transition hover:brightness-110">
          Search
        </button>
      </div>
    </form>
  );
}
