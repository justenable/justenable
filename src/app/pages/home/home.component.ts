import { Component } from '@angular/core';
import { Industry } from 'src/app/models/industry.model';
import { ServiceCard } from 'src/app/models/service-card.model';
import { SITE_INDEX, SitePage } from 'src/app/shared/site-index';
import {
  NODE_NAME_KEYS,
  NODES,
  TERMINAL_NAME_KEYS,
  TERMINALS,
} from './mimic/mimic.component';

/** Stagger between the rows of one site index column, in ms. */
export const INDEX_STAGGER = 60;

/**
 * The hero choreography and the lamp test are pure CSS keyed on `html.motion`
 * (see index.html), so this component holds only the page's data.
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: false,
})
export class HomeComponent {
  /**
   * The cards and the industries strip are the mimic's legend, so their tags
   * and names are read from the mimic's node and terminal lists rather than
   * retyped.
   */
  readonly services: ServiceCard[] = [
    {
      tag: NODES[0],
      titleKey: NODE_NAME_KEYS[0],
      descriptionKey: 'GLOBAL.DESIGN_ENGINEERING_DESCRIPTION',
      media: {
        kind: 'photo',
        src: 'assets/img/design-engineering.webp',
        altKey: 'IMG.DESIGN_ENGINEERING_ALT',
        position: '50% 50%',
        width: 920,
        height: 690,
      },
    },
    {
      tag: NODES[1],
      titleKey: NODE_NAME_KEYS[1],
      descriptionKey: 'GLOBAL.SOFTWARE_ENGINEERING_DESCRIPTION',
      media: { kind: 'ladder' },
    },
    {
      tag: NODES[2],
      titleKey: NODE_NAME_KEYS[2],
      descriptionKey: 'GLOBAL.PROJECT_MANAGEMENT_DESCRIPTION',
      media: {
        kind: 'photo',
        src: 'assets/img/project-management.webp',
        altKey: 'IMG.PROJECT_MANAGEMENT_ALT',
        position: '50% 50%',
        width: 920,
        height: 690,
      },
    },
    {
      tag: NODES[3],
      titleKey: NODE_NAME_KEYS[3],
      descriptionKey: 'GLOBAL.MAINTENANCE_AND_GENERAL_WORK_DESCRIPTION',
      media: {
        kind: 'photo',
        src: 'assets/img/maintenance-and-general-work.webp',
        altKey: 'IMG.MAINTENANCE_ALT',
        position: '50% 50%',
        width: 920,
        height: 690,
      },
    },
  ];

  readonly industries: Industry[] = TERMINALS.map((tag, i) => ({
    tag,
    nameKey: TERMINAL_NAME_KEYS[i],
  }));

  /** The site index: every numbered section of the two service pages. */
  readonly siteIndex = SITE_INDEX;
  readonly indexStagger = INDEX_STAGGER;

  /** Id of the eyebrow that labels a page's list in the index, e.g. `index-automation`. */
  indexLabelId(page: SitePage): string {
    return `index-${page.url.replace(/^\//, '')}`;
  }
}
