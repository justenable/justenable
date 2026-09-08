import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, RouterModule } from '@angular/router';
import {
  provideTranslateService,
  TranslatePipe,
  TranslateService,
} from '@ngx-translate/core';
import { ContentsItem, TitleBlockComponent } from './title-block.component';

@Component({
  template: `
    <app-title-block
      [tag]="tag"
      eyebrowKey="NAVIGATION.AUTOMATION"
      titleKey="GLOBAL.AUTOMATION_INTRO"
      [leadKey]="leadKey"
      [leadParams]="{ companyName: 'Just Enable' }"
      [contents]="contents"
    />
  `,
  standalone: false,
})
class HostComponent {
  tag?: string = 'A';
  leadKey?: string = 'GLOBAL.AUTOMATION_INTRO_TEXT';
  contents?: ContentsItem[] = [
    { id: 'a-01', tag: 'A-01', key: 'GLOBAL.PROCESS_AUTOMATION' },
    { id: 'a-02', tag: 'A-02', key: 'GLOBAL.INDUSTRIAL_AUTOMATION' },
  ];
}

describe('TitleBlockComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let element: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TitleBlockComponent, HostComponent],
      imports: [TranslatePipe, RouterModule],
      providers: [provideRouter([]), provideTranslateService()],
    });
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', {
      'NAVIGATION.AUTOMATION': 'Automation',
      'GLOBAL.AUTOMATION_INTRO': 'Automation services',
      'GLOBAL.AUTOMATION_INTRO_TEXT': 'At {{ companyName }}, we automate.',
      'GLOBAL.PROCESS_AUTOMATION': 'Process automation',
      'GLOBAL.INDUSTRIAL_AUTOMATION': 'Industrial automation',
      'A11Y.CONTENTS': 'On this page',
    });
    translate.use('en');
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('renders exactly one H1 with the translated title', () => {
    const headings = element.querySelectorAll('h1');
    expect(headings.length).toBe(1);
    expect(headings[0].textContent?.trim()).toBe('Automation services');
  });

  it('prefixes the eyebrow with the tag and interpolates the lead', () => {
    const eyebrow = element.querySelector('.eyebrow');
    const tag = eyebrow?.querySelector('.tag');
    expect(tag?.textContent).toBe('A');
    // The title block sits on the canvas, where the plate default ink is too light.
    expect(tag?.classList).toContain('text-ink-muted');
    expect(eyebrow?.textContent).toContain('Automation');
    expect(element.querySelector('p.text-lead')?.textContent?.trim()).toBe(
      'At Just Enable, we automate.'
    );
  });

  it('lists the contents as fragment links in a labelled nav', () => {
    const nav = element.querySelector('nav');
    expect(nav?.getAttribute('aria-label')).toBe('On this page');
    const links = Array.from(nav?.querySelectorAll('a') ?? []);
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '/#a-01',
      '/#a-02',
    ]);
    expect(links[0].textContent?.replace(/\s+/g, ' ').trim()).toBe(
      'A-01 Process automation'
    );
  });

  it('omits the tag, lead and contents when they are not given', () => {
    host.tag = undefined;
    host.leadKey = undefined;
    host.contents = undefined;
    fixture.detectChanges();

    expect(element.querySelector('.eyebrow .tag')).toBeNull();
    expect(element.querySelector('.eyebrow')?.textContent?.trim()).toBe(
      'Automation'
    );
    expect(element.querySelector('p.text-lead')).toBeNull();
    expect(element.querySelector('nav')).toBeNull();
    expect(element.querySelectorAll('h1').length).toBe(1);
  });
});
