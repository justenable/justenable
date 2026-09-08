import { Component } from '@angular/core';

/**
 * A-04's figure: an integration bus. Three source databases drop onto a
 * horizontal bus (drawn like the mimic's: stroke 3, chamfered branches,
 * junction dots) that feeds a report and a dashboard. Decorative: the
 * caption under it carries the words.
 */
@Component({
  selector: 'app-integration-figure',
  templateUrl: './integration-figure.component.html',
  styleUrl: './integration-figure.component.scss',
  standalone: false,
})
export class IntegrationFigureComponent {}
