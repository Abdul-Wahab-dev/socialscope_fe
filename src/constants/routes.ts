export const routes = {
  home: '/',
  discover: '/discover',
  login: '/login',
  register: '/register',
  creatorPublic: (username: string) => `/c/${username}`,
  creator: {
    root: '/creator',
    profile: '/creator/profile',
    socials: '/creator/socials',
    rates: '/creator/rates',
    portfolio: '/creator/portfolio',
  },
  brand: {
    root: '/brand',
    profile: '/brand/profile',
    saved: '/brand/saved',
    billing: '/brand/billing',
  },
  collabs: {
    root: '/collabs',
    detail: (id: string) => `/collabs/${id}`,
  },
  settings: '/settings',
  checkout: {
    mock: '/checkout/mock',
    success: '/checkout/success',
    cancelled: '/checkout/cancelled',
  },
} as const;

export const dashboardHome = (role?: string) => (role === 'brand' ? routes.brand.root : routes.creator.root);
