import { Component } from '@angular/core';
import { INDUSTRY_KEYS, SERVICE_KEYS } from 'src/app/shared/catalogue';
import { LAMP_PATH } from 'src/app/shared/ui/lamp/lamp.component';

export const NODES = ['S1', 'S2', 'S3', 'S4'] as const;
export const TERMINALS = ['X1', 'X2', 'X3', 'X4'] as const;

/** Translated name of each service node, in NODES order; the legend of S1 to S4. */
export const NODE_NAME_KEYS = SERVICE_KEYS;

/** Translated name of each terminal, in TERMINALS order; the legend of X1 to X4. */
export const TERMINAL_NAME_KEYS = INDUSTRY_KEYS;

/** Fragment of the home H2 each kind of node links to. */
export const NODE_HREF = '#services';
export const TERMINAL_HREF = '#industries';

// The shared path is drawn in a 10 x 10 box; the mimic renders it at 14px.
const LAMP_SCALE = 1.4;
const LAMP_HALF = 5 * LAMP_SCALE;

/** One service and the terminal on its row (landscape) or column (portrait). */
interface Lane {
  node: string;
  nodeKey: string;
  terminal: string;
  terminalKey: string;
  /** Selector hooks the path highlight keys on: `node--s1`, `node--x1`, `feeder--s1`, `output--x1`. */
  nodeClass: string;
  terminalClass: string;
  feederClass: string;
  outputClass: string;
}

interface Row extends Lane {
  /** Row centre in the landscape viewBox. */
  y: number;
}

interface Column extends Lane {
  /** Column centre in the portrait viewBox. */
  x: number;
}

function lane(i: number): Lane {
  const node = NODES[i];
  const terminal = TERMINALS[i];
  return {
    node,
    nodeKey: NODE_NAME_KEYS[i],
    terminal,
    terminalKey: TERMINAL_NAME_KEYS[i],
    nodeClass: `node--${node.toLowerCase()}`,
    terminalClass: `node--${terminal.toLowerCase()}`,
    feederClass: `feeder--${node.toLowerCase()}`,
    outputClass: `output--${terminal.toLowerCase()}`,
  };
}

/**
 * The signature element: a single-line plant overview drawn the way a SCADA
 * screen draws a plant. The four services (S1 to S4) feed a bus that
 * terminates in the four industries (X1 to X4), each with a lit lamp.
 *
 * Only tags live inside the SVG; the translated names sit on the service
 * cards and the industries strip below, in the description, and on the
 * nodes' accessible names. Each node and terminal is an SVG anchor to the
 * matching home section, and hovering or focusing one selects its path:
 * the stylesheet lights the feeder, the bus and the outputs it reaches in
 * accent stroke (`:has()` on the svg, keyed on the lane classes). Two
 * variants are rendered and CSS shows one: landscape from md, portrait
 * below. The lamp test keys on `html.motion`, which index.html sets before
 * first paint unless the visitor prefers reduced motion, and starts after
 * `--lamp-test-delay` (0 unless the host sets it).
 */
@Component({
  selector: 'app-mimic',
  templateUrl: './mimic.component.html',
  styleUrl: './mimic.component.scss',
  standalone: false,
})
export class MimicComponent {
  readonly lampPath = LAMP_PATH;
  readonly nodeHref = NODE_HREF;
  readonly terminalHref = TERMINAL_HREF;

  /** Landscape: one row per service, feeding a vertical bus at x = 240. */
  readonly rows: Row[] = NODES.map((_, i) => ({ ...lane(i), y: 56 + 64 * i }));

  /** Portrait: one column per service, dropping onto a horizontal bus at y = 128. */
  readonly columns: Column[] = NODES.map((_, i) => ({ ...lane(i), x: 43 + 78 * i }));

  lampTransform(cx: number, cy: number): string {
    return `translate(${cx - LAMP_HALF} ${cy - LAMP_HALF}) scale(${LAMP_SCALE})`;
  }

  /** The feeder from the S face to its bus dot, as one path the signal can travel. */
  rowFeeder(row: Row): string {
    return `M112 ${row.y} H232 L240 ${row.y + 8}`;
  }

  columnFeeder(column: Column): string {
    return `M${column.x} 48 V120 L${column.x + 8} 128`;
  }
}
