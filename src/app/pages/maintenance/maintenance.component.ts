import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ContentSection,
  GlyphVariant,
} from 'src/app/models/content-section.model';
import { TitledText } from 'src/app/models/titled-text.model';
import { UtilsService } from 'src/app/services/utils.service';
import { ContentsItem } from 'src/app/shared/components/title-block/title-block.component';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrl: './maintenance.component.scss',
  standalone: false,
})
export class MaintenanceComponent {
  readonly params = { companyName: 'Just Enable' };

  readonly sections: ContentSection<{ glyph: GlyphVariant }>[] = [
    {
      tag: 'M-01',
      id: 'm-01',
      title: 'GLOBAL.PREVENTIVE_MAINTENANCE',
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
      texts: [
        'GLOBAL.FACILITY_MAINTENACE_TEXT.0',
        'GLOBAL.FACILITY_MAINTENACE_TEXT.1',
        'GLOBAL.FACILITY_MAINTENACE_TEXT.2',
      ],
      figure: { glyph: 'facility' },
    },
  ];

  readonly contents: ContentsItem[] = this.sections.map(
    ({ id, tag, title }) => ({ id, tag, key: title })
  );

  readonly outroItems$: Observable<TitledText[]> = this.utils.streamTitledList(
    'GLOBAL.MAINTENANCE_OUTRO_TEXT'
  );

  constructor(private utils: UtilsService) {}
}
