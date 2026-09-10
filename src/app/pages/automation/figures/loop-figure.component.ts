import { Component, ChangeDetectionStrategy } from '@angular/core';

/**
 * A-02's figure: a P&ID fragment of a level control loop. A tank with a
 * level transmitter feeds a pump and a control valve; dashed signal lines
 * run from the transmitter to the PLC and from the PLC to the valve's
 * diaphragm actuator. Decorative: the caption under it carries the words.
 */
@Component({
  selector: 'app-loop-figure',
  templateUrl: './loop-figure.component.html',
  styleUrl: './loop-figure.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LoopFigureComponent {}
