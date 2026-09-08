export interface NavItem {
  /** Translation key of the label. */
  key: string;
  url: string;
  /** Rendered as the primary button in the header bar and panel. */
  primary?: boolean;
}

// Header bar, mobile panel and footer all render from this list.
export const NAV: readonly NavItem[] = [
  { key: 'NAVIGATION.HOME', url: '' },
  { key: 'NAVIGATION.AUTOMATION', url: '/automation' },
  { key: 'NAVIGATION.MAINTENANCE', url: '/maintenance' },
  { key: 'NAVIGATION.ABOUT_US', url: '/about-us' },
  { key: 'NAVIGATION.CONTACT_US', url: '/contact-us', primary: true },
];
