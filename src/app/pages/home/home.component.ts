import { isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { Industry } from 'src/app/models/industry.model';
import { ServiceCard } from 'src/app/models/service-card.model';
import { readStorage, writeStorage } from 'src/app/shared/storage';
import { NODES, TERMINALS } from './mimic/mimic.component';

/** Session flag: the lamp test runs once per browser session. */
export const LAMP_TEST_STORAGE_KEY = 'je:lamp-test';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: false,
})
export class HomeComponent {
  /**
   * Bound as `.is-testing` on the mimic. Decided here, in the constructor,
   * so the hydrating render already carries the hidden start state: a class
   * added after that render would show the finished picture, hide it, then
   * animate.
   */
  readonly testing: boolean;

  /**
   * The cards and the industries strip are the mimic's legend, so their tags
   * are read from the mimic's node and terminal lists rather than retyped.
   */
  readonly services: ServiceCard[] = [
    {
      tag: NODES[0],
      titleKey: 'GLOBAL.DESIGN_ENGINEERING',
      descriptionKey: 'GLOBAL.DESIGN_ENGINEERING_DESCRIPTION',
      media: {
        kind: 'photo',
        src: 'assets/img/design-engineering.webp',
        altKey: 'IMG.DESIGN_ENGINEERING_ALT',
        // Keeps the calipers and the bearing inside the 4:3 crop.
        position: '50% 40%',
        width: 634,
        height: 953,
      },
    },
    {
      tag: NODES[1],
      titleKey: 'GLOBAL.SOFTWARE_ENGINEERING',
      descriptionKey: 'GLOBAL.SOFTWARE_ENGINEERING_DESCRIPTION',
      media: { kind: 'ladder' },
    },
    {
      tag: NODES[2],
      titleKey: 'GLOBAL.PROJECT_MANAGEMENT',
      descriptionKey: 'GLOBAL.PROJECT_MANAGEMENT_DESCRIPTION',
      media: {
        kind: 'photo',
        src: 'assets/img/project-management-2.webp',
        altKey: 'IMG.PROJECT_MANAGEMENT_ALT',
        position: '50% 50%',
        width: 850,
        height: 540,
      },
    },
    {
      tag: NODES[3],
      titleKey: 'GLOBAL.MAINTENANCE_AND_GENERAL_WORK',
      descriptionKey: 'GLOBAL.MAINTENANCE_AND_GENERAL_WORK_DESCRIPTION',
      media: {
        kind: 'photo',
        src: 'assets/img/maintenance-and-general-work.webp',
        altKey: 'IMG.MAINTENANCE_ALT',
        // Keeps the hands and the box inside the 4:3 crop.
        position: '65% 50%',
        width: 1431,
        height: 955,
      },
    },
  ];

  readonly industries: Industry[] = [
    { tag: TERMINALS[0], nameKey: 'GLOBAL.FMCG' },
    { tag: TERMINALS[1], nameKey: 'GLOBAL.PET' },
    { tag: TERMINALS[2], nameKey: 'GLOBAL.MINING' },
    { tag: TERMINALS[3], nameKey: 'GLOBAL.OIL_AND_GAS' },
  ];

  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor() {
    // Only run when the flag actually persists: with storage blocked the
    // test would otherwise replay on every return to the home page.
    this.testing =
      this.isBrowser &&
      this.lampTestPending() &&
      writeStorage('session', LAMP_TEST_STORAGE_KEY, '1');
  }

  private lampTestPending(): boolean {
    return (
      readStorage('session', LAMP_TEST_STORAGE_KEY) !== '1' &&
      !window.matchMedia(REDUCED_MOTION_QUERY).matches
    );
  }
}
