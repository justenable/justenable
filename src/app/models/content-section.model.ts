export type GlyphVariant =
  | 'preventive'
  | 'corrective'
  | 'predictive'
  | 'asset'
  | 'facility';

/**
 * One numbered section of a service page. `figure` is whatever the page's
 * template needs to pick the drawing for the section; each page fixes the
 * type parameter to its own figure union.
 */
export interface ContentSection<TFigure = string> {
  /** Locale-invariant section marker, e.g. `A-01`. */
  tag: string;
  /** Fragment target of the section's H2, e.g. `a-01`. */
  id: string;
  title: string;
  texts: string[];
  figure: TFigure;
}
