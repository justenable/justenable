import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { TitledText } from 'src/app/models/titled-text.model';
import { SharedModule } from 'src/app/shared/shared.module';
import { sitePage } from 'src/app/shared/site-index';
import { AutomationComponent } from './automation.component';
import { AUTOMATION_FIGURES } from './automation.module';

const CAPTIONS = {
  'AUTOMATION.FIGURE_PROCESS': 'Approval workflow, automated path',
  'AUTOMATION.FIGURE_INDUSTRIAL': 'Level control loop',
  'AUTOMATION.FIGURE_IT': 'Server provisioning',
  'AUTOMATION.FIGURE_DATA': 'Integration bus',
};

const OUTRO_TITLE = {
  'GLOBAL.AUTOMATION_OUTRO': 'Partner with {{ companyName }} for automation excellence',
};

const normalize = (text: string | null | undefined): string =>
  text?.replace(/\s+/g, ' ').trim() ?? '';

describe('AutomationComponent', () => {
  let component: AutomationComponent;
  let fixture: ComponentFixture<AutomationComponent>;
  let translate: TranslateService;
  let element: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AutomationComponent, ...AUTOMATION_FIGURES],
      imports: [SharedModule],
      providers: [provideRouter([]), provideTranslateService()],
    });
    translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', { ...CAPTIONS, ...OUTRO_TITLE });
    translate.use('en');
    fixture = TestBed.createComponent(AutomationComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('defines the four automation sections in order', () => {
    expect(component.sections.length).toBe(4);
    expect(component.sections.map((section) => section.tag)).toEqual([
      'A-01',
      'A-02',
      'A-03',
      'A-04',
    ]);
    expect(component.sections.map((section) => section.figure)).toEqual([
      'process',
      'loop',
      'rack',
      'integration',
    ]);
    for (const section of component.sections) {
      expect(section.texts.length).toBeGreaterThan(0);
    }
  });

  it('lists the index sections and then the reason sheet as its contents', () => {
    expect(component.sheet).toEqual({
      id: 'a-05',
      tag: 'A-05',
      key: 'GLOBAL.AUTOMATION_OUTRO',
      params: component.params,
    });
    expect(component.contents).toEqual([
      ...sitePage('/automation').sections,
      component.sheet,
    ]);
    expect(component.contents.map((item) => item.id)).toEqual([
      'a-01',
      'a-02',
      'a-03',
      'a-04',
      'a-05',
    ]);
  });

  // The index is the one list the rail, the contents row and the home
  // index read; the sections must not drift from it.
  it('keeps its sections in step with the site index', () => {
    expect(
      component.sections.map(({ id, tag, title }) => ({ id, tag, key: title }))
    ).toEqual(sitePage('/automation').sections);
  });

  it('mounts the section rail ahead of the sections with one link per item', () => {
    const rail = element.querySelector('.page-rail > app-section-rail:first-child');
    expect(rail).not.toBeNull();
    const links = Array.from(rail?.querySelectorAll('a') ?? []);
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '/#a-01',
      '/#a-02',
      '/#a-03',
      '/#a-04',
      '/#a-05',
    ]);
    links.slice(0, 4).forEach((link, index) => {
      const item = component.contents[index];
      expect(normalize(link.textContent)).toContain(item.tag);
      expect(normalize(link.textContent)).toContain(item.key);
    });
    // The sheet's title interpolates the company name, in the rail as on the sheet.
    expect(normalize(links[4].textContent)).toBe(
      'A-05 Partner with Just Enable for automation excellence'
    );
    expect(normalize(element.querySelector('app-title-block nav a[href="/#a-05"]')?.textContent)).toBe(
      'A-05 Partner with Just Enable for automation excellence'
    );
  });

  it('renders one H1, then the sections, the reason sheet and the CTA in the rail grid', () => {
    expect(element.querySelectorAll('h1').length).toBe(1);
    const headings = Array.from(element.querySelectorAll('.page-rail h2'));
    expect(headings.map((heading) => heading.id)).toEqual([
      'a-01',
      'a-02',
      'a-03',
      'a-04',
      'a-05',
    ]);
    expect(element.querySelectorAll('.page-rail app-feature-section').length).toBe(4);
    expect(normalize(element.querySelector('.page-rail app-reason-sheet h2#a-05')?.textContent)).toBe(
      'Partner with Just Enable for automation excellence'
    );
    expect(
      element.querySelector('.page-rail app-cta-band a[href="/contact-us"]')
    ).not.toBeNull();
  });

  it('draws each section its own figure, in order, with no Lottie left', () => {
    const figures = Array.from(element.querySelectorAll('app-feature-section app-figure'));
    expect(figures.length).toBe(4);
    expect(
      figures.map((figure) => figure.querySelector('.figure__art > *')?.tagName.toLowerCase())
    ).toEqual(['app-process-figure', 'app-loop-figure', 'app-rack-figure', 'app-integration-figure']);
    expect(element.querySelector('ng-lottie, app-lottie-figure')).toBeNull();
  });

  it('captions every figure from its own key', () => {
    const captions = Array.from(element.querySelectorAll('app-figure figcaption')).map((caption) =>
      caption.textContent?.trim()
    );
    expect(captions).toEqual([
      CAPTIONS['AUTOMATION.FIGURE_PROCESS'],
      CAPTIONS['AUTOMATION.FIGURE_INDUSTRIAL'],
      CAPTIONS['AUTOMATION.FIGURE_IT'],
      CAPTIONS['AUTOMATION.FIGURE_DATA'],
    ]);
  });

  it('lights exactly one accent element per figure', () => {
    const drawings = Array.from(element.querySelectorAll<SVGSVGElement>('app-figure svg'));
    expect(drawings.length).toBe(4);
    for (const svg of drawings) {
      expect(svg.getAttribute('aria-hidden')).toBe('true');
      const markers = Array.from(svg.querySelectorAll('.figure-marker'));
      expect(markers.length).toBe(1);
      // The accent token from styles.scss, so a marker in ink would fail here.
      expect(getComputedStyle(markers[0]).fill).toBe('rgb(255, 106, 0)');
    }
  });

  it('streams the outro items from the translations', () => {
    translate.setTranslation(
      'en',
      { 'GLOBAL.AUTOMATION_OUTRO_TEXT.0': 'Why: because' },
      true
    );

    let items: TitledText[] = [];
    component.outroItems$.subscribe((value) => (items = value));

    expect(items).toEqual([{ title: 'Why', text: 'because' }]);
  });
});
