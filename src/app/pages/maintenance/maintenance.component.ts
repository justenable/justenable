import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ContentSection,
  GlyphVariant,
} from 'src/app/models/content-section.model';
import { TitledText } from 'src/app/models/titled-text.model';
import { UtilsService } from 'src/app/services/utils.service';
import { ContentsItem } from 'src/app/shared/components/title-block/title-block.component';
import { sitePage } from 'src/app/shared/site-index';

/**
 * A section plus the one plain sentence that frames it, as on the automation
 * page: only the service pages carry a framing sentence, so it is not part of
 * the shared `ContentSection`.
 */
type MaintenanceSection = ContentSection<{ glyph: GlyphVariant }> & {
  intro: string;
};

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrl: './maintenance.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class MaintenanceComponent {
  readonly params = { companyName: 'Just Enable' };

  readonly sections: MaintenanceSection[] = [
    {
      tag: 'M-01',
      id: 'm-01',
      title: 'GLOBAL.PREVENTIVE_MAINTENANCE',
      intro: 'GLOBAL.PREVENTIVE_MAINTENANCE_INTRO',
      texts: [
        'GLOBAL.PREVENTIVE_MAINTENANCE_TEXT.0',
        'GLOBAL.PREVENTIVE_MAINTENANCE_TEXT.1',
        'GLOBAL.PREVENTIVE_MAINTENANCE_TEXT.2',
      ],
      figure: { glyph: 'preventive' },
    },
    {
      tag: 'M-02',
      id: 'm-02',
      title: 'GLOBAL.CORRECTIVE_MAINTENANCE',
      intro: 'GLOBAL.CORRECTIVE_MAINTENANCE_INTRO',
      texts: [
        'GLOBAL.CORRECTIVE_MAINTENANCE_TEXT.0',
        'GLOBAL.CORRECTIVE_MAINTENANCE_TEXT.1',
        'GLOBAL.CORRECTIVE_MAINTENANCE_TEXT.2',
      ],
      figure: { glyph: 'corrective' },
    },
    {
      tag: 'M-03',
      id: 'm-03',
      title: 'GLOBAL.PREDICTIVE_MAINTENANCE',
      intro: 'GLOBAL.PREDICTIVE_MAINTENANCE_INTRO',
      texts: [
        'GLOBAL.PREDICTIVE_MAINTENANCE_TEXT.0',
        'GLOBAL.PREDICTIVE_MAINTENANCE_TEXT.1',
        'GLOBAL.PREDICTIVE_MAINTENANCE_TEXT.2',
        'GLOBAL.PREDICTIVE_MAINTENANCE_TEXT.3',
      ],
      figure: { glyph: 'predictive' },
    },
    {
      tag: 'M-04',
      id: 'm-04',
      title: 'GLOBAL.ASSET_MANAGEMENT',
      intro: 'GLOBAL.ASSET_MANAGEMENT_INTRO',
      texts: [
        'GLOBAL.ASSET_MANAGEMENT_TEXT.0',
        'GLOBAL.ASSET_MANAGEMENT_TEXT.1',
        'GLOBAL.ASSET_MANAGEMENT_TEXT.2',
      ],
      figure: { glyph: 'asset' },
    },
    {
      tag: 'M-05',
      id: 'm-05',
      // The key's spelling is what all five locale files carry.
      title: 'GLOBAL.FACILITY_MAINTENACE',
      intro: 'GLOBAL.FACILITY_MAINTENACE_INTRO',
      texts: [
        'GLOBAL.FACILITY_MAINTENACE_TEXT.0',
        'GLOBAL.FACILITY_MAINTENACE_TEXT.1',
        'GLOBAL.FACILITY_MAINTENACE_TEXT.2',
      ],
      figure: { glyph: 'facility' },
    },
  ];

  /** The closing reason sheet: a section of this page, not of the site index. */
  readonly sheet: ContentsItem = {
    id: 'm-06',
    tag: 'M-06',
    key: 'GLOBAL.MAINTENANCE_OUTRO',
    params: this.params,
  };

  /** Every section with an H2, for the rail and the contents row. */
  readonly contents: ContentsItem[] = [
    ...sitePage('/maintenance').sections,
    this.sheet,
  ];

  readonly outroItems$: Observable<TitledText[]> = this.utils.streamTitledList(
    'GLOBAL.MAINTENANCE_OUTRO_TEXT'
  );

  constructor(private utils: UtilsService) {}
}
