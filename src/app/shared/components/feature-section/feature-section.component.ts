import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

/**
 * One service section (A-01..A-04, M-01..M-05) or About row: a section
 * marker, an H2 and two slots. The text sits on the canvas; the figure is
 * whatever the page projects into `[figure]`.
 *
 * `introKey` is an input rather than a second `[body]` element because the
 * intro's step, colour, measure and the gap to the list below it are part of
 * this section's typographic contract: projecting it would make every page
 * repeat those classes, and the `[body]` slot would no longer be one block
 * the page owns end to end.
 */
@Component({
  selector: 'app-feature-section',
  templateUrl: './feature-section.component.html',
  styleUrl: './feature-section.component.scss',
  standalone: false,
  // `id` belongs to the H2 (the fragment target). Angular keeps a static
  // `id="a-01"` written on the host in the DOM as well, so without this the
  // page would carry two elements with that id and the anchor would land on
  // the host instead of the heading. The spec exercises the static form.
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { '[attr.id]': 'null' },
})
export class FeatureSectionComponent {
  @Input({ required: true }) tag!: string;
  @Input({ required: true }) id!: string;
  @Input({ required: true }) titleKey!: string;
  /** One plain sentence between the H2 and the body, for readers who are not engineers. */
  @Input() introKey?: string;
  /** Figure in columns 1 to 5 at lg. Below lg the figure always comes first. */
  @Input() reverse = false;
}
