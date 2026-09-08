import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ContentSection } from 'src/app/models/content-section.model';
import { TitledText } from 'src/app/models/titled-text.model';
import { UtilsService } from 'src/app/services/utils.service';
import { ContentsItem } from 'src/app/shared/components/title-block/title-block.component';

/** The drawn figure each automation section projects into its figure slot. */
export type AutomationFigure = 'process' | 'loop' | 'rack' | 'integration';

const FIGURE_CAPTIONS: Record<AutomationFigure, string> = {
  process: 'AUTOMATION.FIGURE_PROCESS',
  loop: 'AUTOMATION.FIGURE_INDUSTRIAL',
  rack: 'AUTOMATION.FIGURE_IT',
  integration: 'AUTOMATION.FIGURE_DATA',
};

@Component({
  selector: 'app-automation',
  templateUrl: './automation.component.html',
  styleUrl: './automation.component.scss',
  standalone: false,
})
export class AutomationComponent {
  readonly params = { companyName: 'Just Enable' };

  readonly sections: ContentSection<AutomationFigure>[] = [
    {
      tag: 'A-01',
      id: 'a-01',
      title: 'GLOBAL.PROCESS_AUTOMATION',
      texts: [
        'GLOBAL.PROCESS_AUTOMATION_TEXT.0',
        'GLOBAL.PROCESS_AUTOMATION_TEXT.1',
        'GLOBAL.PROCESS_AUTOMATION_TEXT.2',
      ],
      figure: 'process',
    },
    {
      tag: 'A-02',
      id: 'a-02',
      title: 'GLOBAL.INDUSTRIAL_AUTOMATION',
      texts: [
        'GLOBAL.INDUSTRIAL_AUTOMATION_TEXT.0',
        'GLOBAL.INDUSTRIAL_AUTOMATION_TEXT.1',
        'GLOBAL.INDUSTRIAL_AUTOMATION_TEXT.2',
      ],
      figure: 'loop',
    },
    {
      tag: 'A-03',
      id: 'a-03',
      title: 'GLOBAL.IT_INFRASTRUCTURE_AUTOMATION',
      texts: [
        'GLOBAL.IT_INFRASTRUCTURE_AUTOMATION_TEXT.0',
        'GLOBAL.IT_INFRASTRUCTURE_AUTOMATION_TEXT.1',
        'GLOBAL.IT_INFRASTRUCTURE_AUTOMATION_TEXT.2',
      ],
      figure: 'rack',
    },
    {
      tag: 'A-04',
      id: 'a-04',
      title: 'GLOBAL.DATA_INTEGRATION_AND_WORKFLOW_AUTOMATION_MANAGEMENT',
      texts: [
        'GLOBAL.DATA_INTEGRATION_AND_WORKFLOW_AUTOMATION_MANAGEMENT_TEXT.0',
        'GLOBAL.DATA_INTEGRATION_AND_WORKFLOW_AUTOMATION_MANAGEMENT_TEXT.1',
        'GLOBAL.DATA_INTEGRATION_AND_WORKFLOW_AUTOMATION_MANAGEMENT_TEXT.2',
      ],
      figure: 'integration',
    },
  ];

  readonly captions = FIGURE_CAPTIONS;

  readonly contents: ContentsItem[] = this.sections.map(
    ({ id, tag, title }) => ({ id, tag, key: title })
  );

  readonly outroItems$: Observable<TitledText[]> = this.utils.streamTitledList(
    'GLOBAL.AUTOMATION_OUTRO_TEXT'
  );

  constructor(private utils: UtilsService) {}
}
