import { Component, ChangeDetectionStrategy } from '@angular/core';

/**
 * A-03's figure: a rack elevation being provisioned from a terminal. Units
 * are numbered from the bottom as a rack is, so U4 is the top-of-rack switch
 * and U1 to U3 are servers. Decorative: the caption under it carries the
 * words.
 */
@Component({
  selector: 'app-rack-figure',
  templateUrl: './rack-figure.component.html',
  styleUrl: './rack-figure.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class RackFigureComponent {}
