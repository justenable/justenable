import { Component, Input } from '@angular/core';

/**
 * A drawn figure on the canvas: the projected content is an inline SVG in
 * the site's line-drawing language, the caption under it is the only text a
 * reader needs (the SVG itself is aria-hidden by its author). No plate, no
 * frame: the drawing sits on the canvas like the hero mimic does.
 */
@Component({
  selector: 'app-figure',
  standalone: false,
  templateUrl: './figure.component.html',
  styleUrl: './figure.component.scss',
})
export class FigureComponent {
  @Input({ required: true }) captionKey!: string;
}
