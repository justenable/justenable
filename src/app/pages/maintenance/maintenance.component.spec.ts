import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { TitledText } from 'src/app/models/titled-text.model';
import { SharedModule } from 'src/app/shared/shared.module';
import { sitePage } from 'src/app/shared/site-index';
import { MaintenanceComponent } from './maintenance.component';
import { TimelineGlyphComponent } from './timeline-glyph/timeline-glyph.component';

const normalize = (text: string | null | undefined): string =>
  text?.replace(/\s+/g, ' ').trim() ?? '';

describe('MaintenanceComponent', () => {
  let component: MaintenanceComponent;
  let fixture: ComponentFixture<MaintenanceComponent>;
  let translate: TranslateService;
  let element: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MaintenanceComponent, TimelineGlyphComponent],
      imports: [SharedModule],
      providers: [provideRouter([]), provideTranslateService()],
    });
    translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', {
      'GLOBAL.MAINTENANCE_OUTRO': 'Why choose {{ companyName }} for maintenance',
    });
    translate.use('en');
    fixture = TestBed.createComponent(MaintenanceComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('defines the five maintenance sections in order', () => {
    expect(component.sections.length).toBe(5);
    expect(component.sections.map((section) => section.tag)).toEqual([
      'M-01',
      'M-02',
      'M-03',
      'M-04',
      'M-05',
    ]);
    expect(component.sections.map((section) => section.figure.glyph)).toEqual([
      'preventive',
      'corrective',
      'predictive',
      'asset',
      'facility',
    ]);
    for (const section of component.sections) {
      expect(section.title).toMatch(/^GLOBAL\./);
      expect(section.texts.length).toBeGreaterThan(0);
    }
  });

  it('lists the index sections and then the reason sheet as its contents', () => {
    expect(component.sheet).toEqual({
      id: 'm-06',
      tag: 'M-06',
      key: 'GLOBAL.MAINTENANCE_OUTRO',
      params: component.params,
    });
    expect(component.contents).toEqual([
      ...sitePage('/maintenance').sections,
      component.sheet,
    ]);
    expect(component.contents.map((item) => item.id)).toEqual([
      'm-01',
      'm-02',
      'm-03',
      'm-04',
      'm-05',
      'm-06',
    ]);
  });

  // The index is the one list the rail, the contents row and the home
  // index read; the sections must not drift from it.
  it('keeps its sections in step with the site index', () => {
    expect(
      component.sections.map(({ id, tag, title }) => ({ id, tag, key: title }))
    ).toEqual(sitePage('/maintenance').sections);
  });

  it('mounts the section rail ahead of the sections with one link per item', () => {
    const rail = element.querySelector('.page-rail > app-section-rail:first-child');
    expect(rail).not.toBeNull();
    const links = Array.from(rail?.querySelectorAll('a') ?? []);
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '/#m-01',
      '/#m-02',
      '/#m-03',
      '/#m-04',
      '/#m-05',
      '/#m-06',
    ]);
    links.slice(0, 5).forEach((link, index) => {
      const item = component.contents[index];
      expect(normalize(link.textContent)).toContain(item.tag);
      expect(normalize(link.textContent)).toContain(item.key);
    });
    // The sheet's title interpolates the company name, in the rail as on the sheet.
    expect(normalize(links[5].textContent)).toBe('M-06 Why choose Just Enable for maintenance');
    expect(normalize(element.querySelector('app-title-block nav a[href="/#m-06"]')?.textContent)).toBe(
      'M-06 Why choose Just Enable for maintenance'
    );
  });

  it('renders one H1, then focusable sections, the reason sheet and the CTA in the rail grid', () => {
    expect(element.querySelectorAll('h1').length).toBe(1);
    const headings = Array.from(element.querySelectorAll('.page-rail h2'));
    expect(headings.map((heading) => heading.id)).toEqual([
      'm-01',
      'm-02',
      'm-03',
      'm-04',
      'm-05',
      'm-06',
    ]);
    for (const heading of headings.slice(0, 5)) {
      expect(heading.getAttribute('tabindex')).toBe('-1');
    }
    expect(element.querySelectorAll('.page-rail app-feature-section').length).toBe(5);
    expect(normalize(element.querySelector('.page-rail app-reason-sheet h2#m-06')?.textContent)).toBe(
      'Why choose Just Enable for maintenance'
    );
    expect(
      element.querySelector('.page-rail app-cta-band a[href="/contact-us"]')
    ).not.toBeNull();
  });

  it('draws a captioned glyph in every section and no Lottie', () => {
    const glyphs = Array.from(element.querySelectorAll('app-timeline-glyph'));
    expect(glyphs.length).toBe(5);
    expect(glyphs.map((glyph) => glyph.querySelector('figcaption')?.textContent?.trim())).toEqual([
      'MAINTENANCE.GLYPH_PREVENTIVE',
      'MAINTENANCE.GLYPH_CORRECTIVE',
      'MAINTENANCE.GLYPH_PREDICTIVE',
      'MAINTENANCE.GLYPH_ASSET',
      'MAINTENANCE.GLYPH_FACILITY',
    ]);
    expect(element.querySelector('ng-lottie, app-lottie-figure')).toBeNull();
  });

  it('draws every glyph straight on the canvas with one accent marker', () => {
    const glyphs = Array.from(element.querySelectorAll('app-timeline-glyph'));
    for (const glyph of glyphs) {
      expect(glyph.querySelector('app-figure figure svg[aria-hidden="true"]')).not.toBeNull();
      expect(glyph.querySelector('.plate, .screen')).toBeNull();
      expect(glyph.querySelectorAll('.glyph__marker').length).toBe(1);
    }
  });

  it('streams the outro items from the translations', () => {
    translate.setTranslation(
      'en',
      { 'GLOBAL.MAINTENANCE_OUTRO_TEXT.0': 'Why: because' },
      true
    );

    let items: TitledText[] = [];
    component.outroItems$.subscribe((value) => (items = value));

    expect(items).toEqual([{ title: 'Why', text: 'because' }]);
  });
});
