/** Central query-key factory so invalidation stays consistent across the app. */
export const queryKeys = {
  me: ['auth', 'me'] as const,
  meta: {
    categories: ['meta', 'categories'] as const,
    config: ['meta', 'config'] as const,
  },
  creator: {
    me: ['creator', 'me'] as const,
    insights: ['creator', 'insights'] as const,
    rateCards: ['creator', 'rate-cards'] as const,
    portfolio: ['creator', 'portfolio'] as const,
    socials: ['creator', 'socials'] as const,
  },
  brand: {
    me: ['brand', 'me'] as const,
    saved: ['brand', 'saved'] as const,
  },
  search: {
    results: (params: Record<string, unknown>) => ['search', 'creators', params] as const,
    quota: ['search', 'quota'] as const,
  },
  collabs: {
    all: ['collabs'] as const,
    list: (params: Record<string, unknown>) => ['collabs', 'list', params] as const,
    detail: (id: string) => ['collabs', 'detail', id] as const,
    messages: (id: string) => ['collabs', 'messages', id] as const,
    unread: ['collabs', 'unread'] as const,
  },
  payments: {
    list: ['payments'] as const,
    detail: (id: string) => ['payments', id] as const,
  },
};
