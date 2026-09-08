// Shared by the footer, the contact page and the nameplate.
export const CONTACT = {
  email: 'info@justenable.co.za',
  phone: '+27 72 848 6786',
  mobile: '+27 87 265 2874',
  phoneHref: 'tel:+27728486786',
  mobileHref: 'tel:+27872652874',
  addressLines: ['68 Glenwood Rd', 'Lynnwood Glen', 'Pretoria, 0081', 'South Africa'],
  /** The locality only, for the nameplate; the street and postal code stay in addressLines. */
  locality: 'Lynnwood Glen, Pretoria, South Africa',
  mapsUrl: 'https://goo.gl/maps/fc5xF1pbYNjvLxGg8',
} as const;
