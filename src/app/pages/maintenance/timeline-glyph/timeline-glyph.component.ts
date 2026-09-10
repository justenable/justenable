import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { GlyphVariant } from 'src/app/models/content-section.model';

const CAPTION_KEYS: Record<GlyphVariant, string> = {
  preventive: 'MAINTENANCE.GLYPH_PREVENTIVE',
  corrective: 'MAINTENANCE.GLYPH_CORRECTIVE',
  predictive: 'MAINTENANCE.GLYPH_PREDICTIVE',
  asset: 'MAINTENANCE.GLYPH_ASSET',
  facility: 'MAINTENANCE.GLYPH_FACILITY',
};

/** The plain-language outcome each strip's caption becomes the subtitle of. */
const OUTCOME_KEYS: Record<GlyphVariant, string> = {
  preventive: 'MAINTENANCE.GLYPH_PREVENTIVE_OUTCOME',
  corrective: 'MAINTENANCE.GLYPH_CORRECTIVE_OUTCOME',
  predictive: 'MAINTENANCE.GLYPH_PREDICTIVE_OUTCOME',
  asset: 'MAINTENANCE.GLYPH_ASSET_OUTCOME',
  facility: 'MAINTENANCE.GLYPH_FACILITY_OUTCOME',
};

/**
 * The maintenance figure: a schedule strip drawn straight on the canvas
 * through the shared figure wrapper. The SVG is decorative; the figcaption
 * carries the same information as text, so the glyph never says anything
 * the page does not also say in words. Labels inside the SVG are drawing
 * vernacular (axis units, equipment and system tags) and are never
 * translated.
 *
 * Each strip carries exactly one accent marker: the event that is current
 * in the drawing. It is an orange dot, not the lamp: the lamp is reserved
 * for states that can vary, and a point on a schedule cannot go out.
 */
@Component({
  selector: 'app-timeline-glyph',
  templateUrl: './timeline-glyph.component.html',
  styleUrl: './timeline-glyph.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class TimelineGlyphComponent {
  @Input({ required: true }) variant!: GlyphVariant;

  get captionKey(): string {
    return CAPTION_KEYS[this.variant];
  }

  get outcomeKey(): string {
    return OUTCOME_KEYS[this.variant];
  }
}
