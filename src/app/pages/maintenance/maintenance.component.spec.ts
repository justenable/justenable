import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { TitledText } from 'src/app/models/titled-text.model';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaintenanceComponent } from './maintenance.component';
import { TimelineGlyphComponent } from './timeline-glyph/timeline-glyph.component';

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

  it('lists every section in the contents row', () => {
    expect(component.contents.map((item) => item.id)).toEqual([
      'm-01',
      'm-02',
      'm-03',
      'm-04',
      'm-05',
    ]);
    expect(component.contents[0].key).toBe(component.sections[0].title);
  });

  it('renders one H1 and a focusable, fragment-addressable H2 per section', () => {
    expect(element.querySelectorAll('h1').length).toBe(1);
    const headings = Array.from(element.querySelectorAll('h2'));
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
    expect(element.querySelector('app-cta-band a[href="/contact-us"]')).not.toBeNull();
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
