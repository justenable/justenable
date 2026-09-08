import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { TitledText } from 'src/app/models/titled-text.model';
import { SharedModule } from 'src/app/shared/shared.module';
import { AutomationComponent } from './automation.component';
import { AUTOMATION_FIGURES } from './automation.module';

const CAPTIONS = {
  'AUTOMATION.FIGURE_PROCESS': 'Approval workflow, automated path',
  'AUTOMATION.FIGURE_INDUSTRIAL': 'Level control loop',
  'AUTOMATION.FIGURE_IT': 'Server provisioning',
  'AUTOMATION.FIGURE_DATA': 'Integration bus',
};

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
    translate.setTranslation('en', CAPTIONS);
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

  it('lists every section in the contents row', () => {
    expect(component.contents.map((item) => item.id)).toEqual([
      'a-01',
      'a-02',
      'a-03',
      'a-04',
    ]);
    expect(component.contents[0].key).toBe(component.sections[0].title);
  });

  it('renders one H1 and a fragment-addressable H2 per section', () => {
    expect(element.querySelectorAll('h1').length).toBe(1);
    const headings = Array.from(element.querySelectorAll('h2'));
    expect(headings.map((heading) => heading.id)).toEqual([
      'a-01',
      'a-02',
      'a-03',
      'a-04',
      'a-05',
    ]);
    expect(element.querySelector('app-cta-band a[href="/contact-us"]')).not.toBeNull();
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
