import { Component, ChangeDetectionStrategy } from '@angular/core';

/**
 * A-01's figure: an approval workflow as a flow diagram. REQUEST, CHECK,
 * APPROVE and FILE run left to right on the automated (solid) path; the
 * decision after CHECK can also send the item back by hand along the dotted
 * loop. Decorative: the caption under it carries the words.
 */
@Component({
  selector: 'app-process-figure',
  templateUrl: './process-figure.component.html',
  styleUrl: './process-figure.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ProcessFigureComponent {}
