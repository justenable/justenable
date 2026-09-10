import { ContentsItem } from './components/title-block/title-block.component';

export interface SitePage {
  /** Translation key of the page name, e.g. `NAVIGATION.AUTOMATION`. */
  pageKey: string;
  url: string;
  /** The page's numbered sections, in page order; same shape as the title block's contents. */
  sections: ContentsItem[];
}

/**
 * Every numbered section of the two service pages. The pages build their
 * contents rows and section rails from it, and the home page's site index
 * lists it, so a section is added or renamed in one place.
 */
export const SITE_INDEX: readonly SitePage[] = [
  {
    pageKey: 'NAVIGATION.AUTOMATION',
    url: '/automation',
    sections: [
      { id: 'a-01', tag: 'A-01', key: 'GLOBAL.PROCESS_AUTOMATION' },
      { id: 'a-02', tag: 'A-02', key: 'GLOBAL.INDUSTRIAL_AUTOMATION' },
      { id: 'a-03', tag: 'A-03', key: 'GLOBAL.IT_INFRASTRUCTURE_AUTOMATION' },
      {
        id: 'a-04',
        tag: 'A-04',
        key: 'GLOBAL.DATA_INTEGRATION_AND_WORKFLOW_AUTOMATION_MANAGEMENT',
      },
    ],
  },
  {
    pageKey: 'NAVIGATION.MAINTENANCE',
    url: '/maintenance',
    sections: [
      { id: 'm-01', tag: 'M-01', key: 'GLOBAL.PREVENTIVE_MAINTENANCE' },
      { id: 'm-02', tag: 'M-02', key: 'GLOBAL.CORRECTIVE_MAINTENANCE' },
      { id: 'm-03', tag: 'M-03', key: 'GLOBAL.PREDICTIVE_MAINTENANCE' },
      { id: 'm-04', tag: 'M-04', key: 'GLOBAL.ASSET_MANAGEMENT' },
      // The key's spelling is what all five locale files carry.
      { id: 'm-05', tag: 'M-05', key: 'GLOBAL.FACILITY_MAINTENACE' },
    ],
  },
];

/** The index entry of one service page, looked up by its route. */
export function sitePage(url: string): SitePage {
  const page = SITE_INDEX.find((entry) => entry.url === url);
  if (!page) {
    throw new Error(`${url} is not in SITE_INDEX`);
  }
  return page;
}
