import { Component, Input } from '@angular/core';

/**
 * A drawn figure on the canvas: the projected content is an inline SVG in
 * the site's line-drawing language, the caption under it is the only text a
 * reader needs (the SVG itself is aria-hidden by its author). No plate, no
 * frame: the drawing sits on the canvas like the hero mimic does.
 *
 * A figure may lead with an outcome the reader recognises and keep the
 * technical name below it as a subtitle: buyers are usually the research or
 * procurement side rather than the engineers who read a P&ID. Pass
 * `outcomeKey` for that; without it the figure keeps its single mono caption.
 */
@Component({
  selector: 'app-figure',
  standalone: false,
  templateUrl: './figure.component.html',
  styleUrl: './figure.component.scss',
})
export class FigureComponent {
  @Input({ required: true }) captionKey!: string;
  /** Plain-language outcome shown above the caption, which becomes its subtitle. */
  @Input() outcomeKey?: string;
}
