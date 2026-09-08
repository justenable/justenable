/** The figure slot of an About row: the engraved nameplate or one of the drawn figures. */
export type AboutFigure = 'nameplate' | 'office' | 'stack';

export interface AboutSection {
  /** Locale-invariant section marker, e.g. `01`. */
  tag: string;
  /** Fragment target of the section's H2, e.g. `our-story`. */
  id: string;
  titleKey: string;
  /** One translation key per paragraph. */
  textKeys: string[];
  figure: AboutFigure;
}
