import { Component } from '@angular/core';
import { AboutSection } from 'src/app/models/about-section.model';
import { ContentsItem } from 'src/app/shared/components/title-block/title-block.component';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss',
  standalone: false,
})
export class AboutUsComponent {
  readonly sections: AboutSection[] = [
    {
      tag: '01',
      id: 'our-story',
      titleKey: 'GLOBAL.OUR_STORY',
      textKeys: ['GLOBAL.OUR_STORY_TEXT.0', 'GLOBAL.OUR_STORY_TEXT.1'],
      figure: 'nameplate',
    },
    {
      tag: '02',
      id: 'our-culture',
      titleKey: 'GLOBAL.OUR_CULTURE',
      textKeys: ['GLOBAL.OUR_CULTURE_TEXT'],
      figure: 'office',
    },
    {
      tag: '03',
      id: 'technology',
      titleKey: 'GLOBAL.TECHNOLOGY',
      textKeys: ['GLOBAL.TECHNOLOGY_TEXT'],
      figure: 'stack',
    },
  ];

  /** The three rows, for the section rail (from xl) and the title block's contents row (below). */
  readonly contents: ContentsItem[] = this.sections.map(
    ({ id, tag, titleKey }) => ({ id, tag, key: titleKey })
  );
}
