import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CONTACT } from 'src/app/shared/contact';

interface ChannelRow {
  /** Locale-invariant row number, 01 to 04. */
  tag: string;
  labelKey: string;
  href: string;
}

/** A machine-readable value (translate="no", mono-value-l). */
export interface IdentifierChannel extends ChannelRow {
  kind: 'identifier';
  /**
   * The value split where a line may break, rendered with a <wbr> between the
   * parts. The email address has no spaces and is wider than the value track
   * on the narrowest phones; the only break allowed is after the "@", so it
   * reads "info@" over "justenable.co.za" instead of a cut domain.
   */
  valueParts: string[];
}

/**
 * The location row differs in every cell: its value is an English postal
 * address (lang="en", mono-value) and its link opens Google Maps in a new tab.
 */
export interface AddressChannel extends ChannelRow {
  kind: 'address';
  value: string;
}

/** One row of the channel list; the whole row is the link. */
export type ContactChannel = IdentifierChannel | AddressChannel;

/** Email addresses may break after the "@"; other values keep their own spaces. */
export function breakParts(value: string): string[] {
  const at = value.indexOf('@');
  if (at === -1) {
    return [value];
  }
  return [value.slice(0, at + 1), value.slice(at + 1)];
}

const [street, suburb, city] = CONTACT.addressLines;

/**
 * Google Maps URLs directions request. The country is left out: the postal
 * code already places the destination, and the Maps embed's own place card
 * carries the same street address.
 */
export const DIRECTIONS_URL = `https://www.google.com/maps/dir/?${new URLSearchParams({
  api: '1',
  destination: `${street}, ${suburb}, ${city}`,
})}`;

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ContactUsComponent {
  readonly addressLines = CONTACT.addressLines;
  readonly mapsUrl = CONTACT.mapsUrl;
  readonly directionsUrl = DIRECTIONS_URL;

  readonly channels: ContactChannel[] = [
    {
      tag: '01',
      labelKey: 'GLOBAL.EMAIL',
      valueParts: breakParts(CONTACT.email),
      href: `mailto:${CONTACT.email}`,
      kind: 'identifier',
    },
    {
      tag: '02',
      labelKey: 'GLOBAL.PHONE',
      valueParts: breakParts(CONTACT.phone),
      href: CONTACT.phoneHref,
      kind: 'identifier',
    },
    {
      tag: '03',
      labelKey: 'GLOBAL.MOBILE',
      valueParts: breakParts(CONTACT.mobile),
      href: CONTACT.mobileHref,
      kind: 'identifier',
    },
    {
      tag: '04',
      labelKey: 'GLOBAL.LOCATION',
      value: CONTACT.addressLines.join(', '),
      href: CONTACT.mapsUrl,
      kind: 'address',
    },
  ];
}
