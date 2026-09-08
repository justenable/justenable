import { Component } from '@angular/core';

/**
 * The "Our culture" figure: a plan of the office with the desks, the half
 * court and the braai, drawn in the site's line language. Decorative: the
 * caption under it carries the words, so the SVG is hidden from assistive
 * technology and only holds plan tags.
 */
@Component({
  selector: 'app-office-figure',
  templateUrl: './office-figure.component.html',
  styleUrl: './figure.scss',
  standalone: false,
})
export class OfficeFigureComponent {}
