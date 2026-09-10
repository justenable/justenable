import { Component, ChangeDetectionStrategy } from '@angular/core';

/**
 * The "Technology" figure: an exploded elevation of the three layers the
 * company works across, field devices at the bottom, control in the middle,
 * applications on top, with the signal lines that join them. Decorative:
 * the caption carries the words, so the SVG is hidden from assistive
 * technology and only holds tags.
 */
@Component({
  selector: 'app-stack-figure',
  templateUrl: './stack-figure.component.html',
  styleUrl: './figure.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class StackFigureComponent {}
