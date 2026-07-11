import { afterNextRender, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ContentSection } from 'src/app/models/content-section.model';
import { TitledText } from 'src/app/models/titled-text.model';
import { UtilsService } from 'src/app/services/utils.service';
import { register } from 'swiper/element/bundle';
@Component({
    selector: 'app-automation',
    templateUrl: './automation.component.html',
    styleUrls: ['./automation.component.scss'],
    standalone: false
})
export class AutomationComponent {
  companyName = 'Just Enable';
  sections: ContentSection[] = [
    {
      title: 'GLOBAL.PROCESS_AUTOMATION',
      texts: [
        'GLOBAL.PROCESS_AUTOMATION_TEXT.0',
        'GLOBAL.PROCESS_AUTOMATION_TEXT.1',
        'GLOBAL.PROCESS_AUTOMATION_TEXT.2',
      ],
      bgColor: 'bg-white',
      image: '/assets/animation/robot-hand.json',
    },
    {
      title: 'GLOBAL.INDUSTRIAL_AUTOMATION',
      texts: [
        'GLOBAL.INDUSTRIAL_AUTOMATION_TEXT.0',
        'GLOBAL.INDUSTRIAL_AUTOMATION_TEXT.1',
        'GLOBAL.INDUSTRIAL_AUTOMATION_TEXT.2',
      ],
      bgColor: 'bg-gray-100',
      image: '/assets/animation/robot-head.json',
    },
    {
      title: 'GLOBAL.IT_INFRASTRUCTURE_AUTOMATION',
      texts: [
        'GLOBAL.IT_INFRASTRUCTURE_AUTOMATION_TEXT.0',
        'GLOBAL.IT_INFRASTRUCTURE_AUTOMATION_TEXT.1',
        'GLOBAL.IT_INFRASTRUCTURE_AUTOMATION_TEXT.2',
      ],
      bgColor: 'bg-white',

      image: '/assets/animation/coding.json',
    },
    {
      title: 'GLOBAL.DATA_INTEGRATION_AND_WORKFLOW_AUTOMATION_MANAGEMENT',
      texts: [
        'GLOBAL.DATA_INTEGRATION_AND_WORKFLOW_AUTOMATION_MANAGEMENT_TEXT.0',
        'GLOBAL.DATA_INTEGRATION_AND_WORKFLOW_AUTOMATION_MANAGEMENT_TEXT.1',
        'GLOBAL.DATA_INTEGRATION_AND_WORKFLOW_AUTOMATION_MANAGEMENT_TEXT.2',
      ],
      bgColor: 'bg-gray-100',
      image: '/assets/animation/culture.json',
    },
  ];

  outroItems$: Observable<TitledText[]> = this.utils.streamTitledList(
    'GLOBAL.AUTOMATION_OUTRO_TEXT'
  );

  constructor(private utils: UtilsService) {
    // Swiper registers custom elements against the real DOM; browser only.
    afterNextRender(() => register());
  }
}
