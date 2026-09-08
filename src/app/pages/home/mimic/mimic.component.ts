import { Component } from '@angular/core';
import { LAMP_PATH } from 'src/app/shared/ui/lamp/lamp.component';

export const NODES = ['S1', 'S2', 'S3', 'S4'] as const;
export const TERMINALS = ['X1', 'X2', 'X3', 'X4'] as const;

// The shared path is drawn in a 10 x 10 box; the mimic renders it at 14px.
const LAMP_SCALE = 1.4;
const LAMP_HALF = 5 * LAMP_SCALE;

interface Row {
  node: string;
  terminal: string;
  /** Row centre in the landscape viewBox. */
  y: number;
}

interface Column {
  node: string;
  terminal: string;
  /** Column centre in the portrait viewBox. */
  x: number;
}

/**
 * The signature element: a single-line plant overview drawn the way a SCADA
 * screen draws a plant. The four services (S1 to S4) feed a bus that
 * terminates in the four industries (X1 to X4), each with a lit lamp.
 *
 * Only tags live inside the SVG; the translated names sit on the service
 * cards and the industries strip below, and in the description. Two
 * variants are rendered and CSS shows one: landscape from md, portrait
 * below. The host gets `.is-testing` from HomeComponent for the lamp test.
 */
@Component({
  selector: 'app-mimic',
  templateUrl: './mimic.component.html',
  styleUrl: './mimic.component.scss',
  standalone: false,
})
export class MimicComponent {
  readonly lampPath = LAMP_PATH;

  /** Landscape: one row per service, feeding a vertical bus at x = 240. */
  readonly rows: Row[] = NODES.map((node, i) => ({
    node,
    terminal: TERMINALS[i],
    y: 56 + 64 * i,
  }));

  /** Portrait: one column per service, dropping onto a horizontal bus at y = 128. */
  readonly columns: Column[] = NODES.map((node, i) => ({
    node,
    terminal: TERMINALS[i],
    x: 43 + 78 * i,
  }));

  lampTransform(cx: number, cy: number): string {
    return `translate(${cx - LAMP_HALF} ${cy - LAMP_HALF}) scale(${LAMP_SCALE})`;
  }
}
