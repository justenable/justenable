import { Component, Input, numberAttribute, ChangeDetectionStrategy } from '@angular/core';

/**
 * The astroid in a 10 x 10 box: four concave sides, cusps at the box
 * midpoints. The mimic imports this constant for its terminal lamps; the
 * favicon SVG is a static file that carries its own scaled copy.
 */
export const LAMP_PATH = 'M5 0 C5 3 3 5 0 5 C3 5 5 7 5 10 C5 7 7 5 10 5 C7 5 5 3 5 0 Z';

/**
 * The astroid lamp. Its path is a derivation of the logo's spark: the spark
 * is the left half of this astroid (cusps left, top, bottom; flat right edge
 * on the E's stem), so both use the same cubic control offsets and the lamp
 * visibly belongs to the mark.
 *
 * Contract: a lamp is always the sibling of visible text that states the
 * same thing; it never blinks; it is never the only carrier of "current" or
 * "selected". It only appears where its state can vary.
 */
@Component({
  selector: 'app-lamp',
  standalone: false,
  templateUrl: './lamp.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./lamp.component.scss'],
})
export class LampComponent {
  @Input({ required: true }) lit = false;
  /** Rendered size in CSS px: 8 (nav), 10 (rocker knob) or 14 (404). */
  @Input({ transform: numberAttribute }) size = 8;

  readonly path = LAMP_PATH;
}
