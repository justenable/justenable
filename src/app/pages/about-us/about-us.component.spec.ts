import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { FeatureSectionComponent } from 'src/app/shared/components/feature-section/feature-section.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AboutUsComponent } from './about-us.component';
import { OfficeFigureComponent } from './figures/office-figure.component';
import { StackFigureComponent } from './figures/stack-figure.component';
import { NameplateComponent } from './nameplate/nameplate.component';

const normalize = (text: string | null | undefined): string =>
  (text ?? '').replace(/\s+/g, ' ').trim();

describe('AboutUsComponent', () => {
  let component: AboutUsComponent;
  let fixture: ComponentFixture<AboutUsComponent>;
  let element: HTMLElement;

  const sectionElements = (): HTMLElement[] =>
    Array.from(element.querySelectorAll('app-feature-section'));

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AboutUsComponent,
        NameplateComponent,
        OfficeFigureComponent,
        StackFigureComponent,
      ],
      imports: [SharedModule],
      providers: [provideRouter([]), provideTranslateService()],
    });
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', {
      'A11Y.CONTENTS': 'On this page',
      'NAVIGATION.ABOUT_US': 'About us',
      'GLOBAL.OUR_STORY': 'Our story',
      'GLOBAL.OUR_STORY_TEXT.0': 'Just Enable started with roots in software.',
      'GLOBAL.OUR_STORY_TEXT.1': 'Our expert knowledge helps us.',
      'GLOBAL.OUR_CULTURE': 'Our culture',
      'GLOBAL.OUR_CULTURE_TEXT': 'We offer a friendly environment.',
      'GLOBAL.TECHNOLOGY': 'Technology',
      'GLOBAL.TECHNOLOGY_TEXT': 'We build applications.',
      'GLOBAL.CONTACT_US_TEXT': 'Get in touch.',
      'NAVIGATION.CONTACT_US': 'Contact us',
      'ABOUT.FIGURE_CULTURE': 'Office plan, not to scale',
      'ABOUT.FIGURE_TECHNOLOGY': 'From field devices to applications',
    });
    translate.use('en');
    fixture = TestBed.createComponent(AboutUsComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('defines the three about rows in order', () => {
    expect(component.sections.map((section) => section.tag)).toEqual([
      '01',
      '02',
      '03',
    ]);
    expect(component.sections.map((section) => section.figure)).toEqual([
      'nameplate',
      'office',
      'stack',
    ]);
    for (const section of component.sections) {
      expect(section.textKeys.length).toBeGreaterThan(0);
    }
  });

  it('lists the three rows as its contents, in row order', () => {
    expect(component.contents).toEqual([
      { id: 'our-story', tag: '01', key: 'GLOBAL.OUR_STORY' },
      { id: 'our-culture', tag: '02', key: 'GLOBAL.OUR_CULTURE' },
      { id: 'technology', tag: '03', key: 'GLOBAL.TECHNOLOGY' },
    ]);
  });

  it('renders one H1 with the contents row and a fragment-addressable H2 per row', () => {
    const headings = element.querySelectorAll('h1');
    expect(headings.length).toBe(1);
    expect(headings[0].textContent?.trim()).toBe('About us');
    expect(element.querySelector('.eyebrow .tag')).toBeNull();
    expect(element.querySelector('app-title-block p.text-lead')).toBeNull();

    const contentsLinks = Array.from(
      element.querySelectorAll('app-title-block nav a')
    );
    expect(contentsLinks.map((link) => link.getAttribute('href'))).toEqual([
      '/#our-story',
      '/#our-culture',
      '/#technology',
    ]);
    expect(normalize(contentsLinks[0].textContent)).toBe('01 Our story');

    const subheadings = Array.from(element.querySelectorAll('h2'));
    expect(subheadings.map((heading) => heading.id)).toEqual([
      'our-story',
      'our-culture',
      'technology',
    ]);
    expect(subheadings.map((heading) => heading.textContent?.trim())).toEqual([
      'Our story',
      'Our culture',
      'Technology',
    ]);
  });

  it('mounts the section rail ahead of the rows with one link per row', () => {
    const rail = element.querySelector('.page-rail > app-section-rail:first-child');
    expect(rail).not.toBeNull();
    const links = Array.from(rail?.querySelectorAll('a') ?? []);
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '/#our-story',
      '/#our-culture',
      '/#technology',
    ]);
    expect(links.map((link) => normalize(link.textContent))).toEqual([
      '01 Our story',
      '02 Our culture',
      '03 Technology',
    ]);
  });

  it('keeps the three rows and the contact band inside the rail grid', () => {
    expect(element.querySelectorAll('.page-rail app-feature-section').length).toBe(3);
    expect(element.querySelectorAll('.page-rail h2').length).toBe(3);
    expect(
      element.querySelector('.page-rail app-cta-band a[href="/contact-us"]')
    ).not.toBeNull();
    expect(element.querySelector('app-cta-band p')?.textContent?.trim()).toBe(
      'Get in touch.'
    );
  });

  it('renders each paragraph as plain translated text, never as markup', () => {
    const [story, culture, technology] = sectionElements();
    const paragraphs = (section: HTMLElement): HTMLParagraphElement[] =>
      Array.from(section.querySelectorAll('p.text-body'));

    expect(paragraphs(story).map((p) => p.textContent?.trim())).toEqual([
      'Just Enable started with roots in software.',
      'Our expert knowledge helps us.',
    ]);
    expect(paragraphs(culture).length).toBe(1);
    expect(paragraphs(technology).length).toBe(1);
    for (const section of sectionElements()) {
      for (const paragraph of paragraphs(section)) {
        expect(paragraph.children.length).toBe(0);
      }
    }
    expect(element.innerHTML).not.toContain('<br');
  });

  it('puts the nameplate in the story row and nothing else in its figure slot', () => {
    const [story] = sectionElements();
    const nameplate = story.querySelector('app-nameplate');
    expect(nameplate).not.toBeNull();
    expect(nameplate?.parentElement?.classList).toContain('order-first');
    expect(story.querySelector('app-figure')).toBeNull();
    expect(element.querySelectorAll('app-nameplate').length).toBe(1);
    expect(nameplate?.querySelectorAll('dd').length).toBe(6);
  });

  it('draws the office plan under the culture row and the stack under the technology row', () => {
    const [, culture, technology] = sectionElements();

    const office = culture.querySelector('app-figure');
    expect(office?.parentElement?.classList).toContain('order-first');
    expect(office?.querySelector('app-office-figure svg')).not.toBeNull();
    expect(office?.querySelector('figcaption')?.textContent?.trim()).toBe(
      'Office plan, not to scale'
    );

    const stack = technology.querySelector('app-figure');
    expect(stack?.parentElement?.classList).toContain('order-first');
    expect(stack?.querySelector('app-stack-figure svg')).not.toBeNull();
    expect(stack?.querySelector('figcaption')?.textContent?.trim()).toBe(
      'From field devices to applications'
    );

    for (const figure of [office, stack]) {
      const svg = figure?.querySelector('svg');
      expect(svg?.getAttribute('aria-hidden')).toBe('true');
      expect(svg?.querySelectorAll('.figure-accent').length).toBe(1);
    }
  });

  it('no longer plays any Lottie', () => {
    expect(element.querySelector('app-lottie-figure')).toBeNull();
    expect(element.querySelector('ng-lottie')).toBeNull();
    expect(element.querySelector('.screen')).toBeNull();
  });

  it('alternates the figure side from row to row', () => {
    const sections = fixture.debugElement.queryAll(
      By.directive(FeatureSectionComponent)
    );
    expect(
      sections.map((section) => (section.componentInstance as FeatureSectionComponent).reverse)
    ).toEqual([false, true, false]);
  });
});
