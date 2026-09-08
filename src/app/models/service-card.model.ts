export interface PhotoMedia {
  kind: 'photo';
  src: string;
  /** Translation key of the descriptive alt text (an `IMG.*` key). */
  altKey: string;
  /** CSS object-position that keeps the subject inside the 4:3 crop. */
  position: string;
  /** Intrinsic pixel size, so the box is reserved before the file loads. */
  width: number;
  height: number;
}

export interface LadderMedia {
  kind: 'ladder';
}

export type ServiceCardMedia = PhotoMedia | LadderMedia;

export interface ServiceCard {
  /** Locale-invariant identifier, S1 to S4; the mimic's service nodes use the same tags. */
  tag: string;
  titleKey: string;
  descriptionKey: string;
  media: ServiceCardMedia;
}
