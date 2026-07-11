import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ContentSection } from 'src/app/models/content-section.model';
import { TitledText } from 'src/app/models/titled-text.model';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
    selector: 'app-maintenance',
    templateUrl: './maintenance.component.html',
    styleUrls: ['./maintenance.component.scss'],
    standalone: false
})
export class MaintenanceComponent {
  companyName = 'Just Enable';
  sections: ContentSection[] = [
    {
      title: 'GLOBAL.PREVENTIVE_MAINTENANCE',
      texts: [
        'GLOBAL.PREVENTIVE_MAINTENANCE_TEXT.0',
        'GLOBAL.PREVENTIVE_MAINTENANCE_TEXT.1',
        'GLOBAL.PREVENTIVE_MAINTENANCE_TEXT.2',
      ],
      bgColor: 'bg-white',
      image: '/assets/animation/robot-hand.json',
    },
    {
      title: 'GLOBAL.CORRECTIVE_MAINTENANCE',
      texts: [
        'GLOBAL.CORRECTIVE_MAINTENANCE_TEXT.0',
        'GLOBAL.CORRECTIVE_MAINTENANCE_TEXT.1',
        'GLOBAL.CORRECTIVE_MAINTENANCE_TEXT.2',
      ],
      bgColor: 'bg-gray-100',
      image: '/assets/animation/robot-head.json',
    },
    {
      title: 'GLOBAL.PREDICTIVE_MAINTENANCE',
      texts: [
        'GLOBAL.PREDICTIVE_MAINTENANCE_TEXT.0',
        'GLOBAL.PREDICTIVE_MAINTENANCE_TEXT.1',
        'GLOBAL.PREDICTIVE_MAINTENANCE_TEXT.2',
        'GLOBAL.PREDICTIVE_MAINTENANCE_TEXT.3',
      ],
      bgColor: 'bg-white',

      image: '/assets/animation/coding.json',
    },
    {
      title: 'GLOBAL.ASSET_MANAGEMENT',
      texts: [
        'GLOBAL.ASSET_MANAGEMENT_TEXT.0',
        'GLOBAL.ASSET_MANAGEMENT_TEXT.1',
        'GLOBAL.ASSET_MANAGEMENT_TEXT.2',
      ],
      bgColor: 'bg-gray-100',
      image: '/assets/animation/culture.json',
    },
    {
      title: 'GLOBAL.FACILITY_MAINTENACE',
      texts: [
        'GLOBAL.FACILITY_MAINTENACE_TEXT.0',
        'GLOBAL.FACILITY_MAINTENACE_TEXT.1',
        'GLOBAL.FACILITY_MAINTENACE_TEXT.2',
      ],
      bgColor: 'bg-white',

      image: '/assets/animation/technology.json',
    },
  ];

  outroItems$: Observable<TitledText[]> = this.utils.streamTitledList(
    'GLOBAL.MAINTENANCE_OUTRO_TEXT'
  );

  constructor(private utils: UtilsService) {}
}
