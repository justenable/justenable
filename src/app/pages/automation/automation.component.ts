import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { ContentSection } from 'src/app/models/content-section.model';
import { TitledText } from 'src/app/models/titled-text.model';
import { UtilsService } from 'src/app/services/utils.service';
import { ContentsItem } from 'src/app/shared/components/title-block/title-block.component';
import { sitePage } from 'src/app/shared/site-index';

/** The drawn figure each automation section projects into its figure slot. */
export type AutomationFigure = 'process' | 'loop' | 'rack' | 'integration';

/**
 * A section plus the one plain sentence that frames it. The framing lives
 * here rather than on `ContentSection` because only the two service pages
 * carry it; the About rows are already prose.
 */
type AutomationSection = ContentSection<AutomationFigure> & { intro: string };

const FIGURE_CAPTIONS: Record<AutomationFigure, string> = {
  process: 'AUTOMATION.FIGURE_PROCESS',
  loop: 'AUTOMATION.FIGURE_INDUSTRIAL',
  rack: 'AUTOMATION.FIGURE_IT',
  integration: 'AUTOMATION.FIGURE_DATA',
};

/** The plain-language outcome each caption becomes the subtitle of. */
const FIGURE_OUTCOMES: Record<AutomationFigure, string> = {
  process: 'AUTOMATION.FIGURE_PROCESS_OUTCOME',
  loop: 'AUTOMATION.FIGURE_INDUSTRIAL_OUTCOME',
  rack: 'AUTOMATION.FIGURE_IT_OUTCOME',
  integration: 'AUTOMATION.FIGURE_DATA_OUTCOME',
};

@Component({
  selector: 'app-automation',
  templateUrl: './automation.component.html',
  styleUrl: './automation.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class AutomationComponent {
  readonly params = { companyName: 'Just Enable' };

  readonly sections: AutomationSection[] = [
    {
      tag: 'A-01',
      id: 'a-01',
      title: 'GLOBAL.PROCESS_AUTOMATION',
      intro: 'GLOBAL.PROCESS_AUTOMATION_INTRO',
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
      intro: 'GLOBAL.INDUSTRIAL_AUTOMATION_INTRO',
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
      intro: 'GLOBAL.IT_INFRASTRUCTURE_AUTOMATION_INTRO',
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
      intro: 'GLOBAL.DATA_INTEGRATION_AND_WORKFLOW_AUTOMATION_MANAGEMENT_INTRO',
      texts: [
        'GLOBAL.DATA_INTEGRATION_AND_WORKFLOW_AUTOMATION_MANAGEMENT_TEXT.0',
        'GLOBAL.DATA_INTEGRATION_AND_WORKFLOW_AUTOMATION_MANAGEMENT_TEXT.1',
        'GLOBAL.DATA_INTEGRATION_AND_WORKFLOW_AUTOMATION_MANAGEMENT_TEXT.2',
      ],
      figure: 'integration',
    },
  ];

  readonly captions = FIGURE_CAPTIONS;
  readonly outcomes = FIGURE_OUTCOMES;

  /** The closing reason sheet: a section of this page, not of the site index. */
  readonly sheet: ContentsItem = {
    id: 'a-05',
    tag: 'A-05',
    key: 'GLOBAL.AUTOMATION_OUTRO',
    params: this.params,
  };

  /** Every section with an H2, for the rail and the contents row. */
  readonly contents: ContentsItem[] = [
    ...sitePage('/automation').sections,
    this.sheet,
  ];

  readonly outroItems$: Observable<TitledText[]> = this.utils.streamTitledList(
    'GLOBAL.AUTOMATION_OUTRO_TEXT'
  );

  constructor(private utils: UtilsService) {}
}
