import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { blockStorage } from 'src/testing/storage';
import { HomeComponent, LAMP_TEST_STORAGE_KEY } from './home.component';
import { LadderFigureComponent } from './ladder-figure/ladder-figure.component';
import { MimicComponent, NODES, TERMINALS } from './mimic/mimic.component';
import { ServiceCardComponent } from './service-card/service-card.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let element: HTMLElement;

  // The lamp test is decided in the constructor, so each test creates the
  // component itself after arranging the session flag and the media query.
  function create(): void {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  }

  beforeEach(() => {
    sessionStorage.removeItem(LAMP_TEST_STORAGE_KEY);
    TestBed.configureTestingModule({
      declarations: [
        HomeComponent,
        MimicComponent,
        ServiceCardComponent,
        LadderFigureComponent,
      ],
      imports: [SharedModule],
      providers: [provideRouter([]), provideTranslateService()],
    });
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', {
      'HOME.TITLE': 'We deliver electrical, automation and digital solutions',
      'HOME.MIMIC_TITLE': 'Plant overview',
      'HOME.MIMIC_DESC': 'Four services feed four industries.',
      'IMG.DESIGN_ENGINEERING_ALT': 'Calipers and a bearing on a drawing',
      'IMG.PROJECT_MANAGEMENT_ALT': 'A desk with charts',
      'IMG.MAINTENANCE_ALT': 'A technician wiring a box',
    });
    translate.use('en');
  });

  afterEach(() => {
    sessionStorage.removeItem(LAMP_TEST_STORAGE_KEY);
  });

  it('defines the four services S1 to S4 with their media', () => {
    create();
    const tags = component.services.map((service) => service.tag);
    expect(tags).toEqual(['S1', 'S2', 'S3', 'S4']);
    // The cards are the legend of the mimic's service nodes.
    expect(tags).toEqual([...NODES]);
    expect(component.services.map((service) => service.media.kind)).toEqual([
      'photo',
      'ladder',
      'photo',
      'photo',
    ]);
    for (const service of component.services) {
      expect(service.titleKey).toBeTruthy();
      expect(service.descriptionKey).toBeTruthy();
    }
  });

  it('defines the four industry terminals X1 to X4', () => {
    create();
    const tags = component.industries.map((industry) => industry.tag);
    expect(tags).toEqual(['X1', 'X2', 'X3', 'X4']);
    // The strip is the legend of the mimic's terminals.
    expect(tags).toEqual([...TERMINALS]);
    for (const industry of component.industries) {
      expect(industry.nameKey).toBeTruthy();
    }
  });

  it('renders one H1 and one labelled H2 per section', () => {
    create();
    const headings = element.querySelectorAll('h1');
    expect(headings.length).toBe(1);
    expect(headings[0].textContent?.trim()).toBe(
      'We deliver electrical, automation and digital solutions'
    );
    const sections = Array.from(element.querySelectorAll('h2'));
    expect(sections.map((heading) => heading.id)).toEqual([
      'services',
      'industries',
    ]);
    for (const heading of sections) {
      expect(
        element.querySelector(`section[aria-labelledby="${heading.id}"]`)
      ).not.toBeNull();
    }
    expect(element.querySelectorAll('h3').length).toBe(8);
  });

  it('renders the mimic as a titled and described image', () => {
    create();
    const images = Array.from(element.querySelectorAll('app-mimic svg[role="img"]'));
    expect(images.length).toBe(2);
    for (const svg of images) {
      expect(svg.querySelector('title')?.textContent).toBe('Plant overview');
      expect(svg.querySelector('desc')?.textContent).toBe(
        'Four services feed four industries.'
      );
    }
    expect(element.querySelectorAll('app-mimic').length).toBe(1);
  });

  it('links the hero buttons and the CTA band to the other pages', () => {
    create();
    const links = Array.from(element.querySelectorAll('section.hero a[href]'));
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '/contact-us',
      '/automation',
      '/maintenance',
    ]);
    expect(element.querySelector('app-cta-band a[href="/contact-us"]')).not.toBeNull();
  });

  it('renders three described photos and the ladder figure on the service cards', () => {
    create();
    expect(element.querySelectorAll('app-service-card').length).toBe(4);
    const photos = Array.from(element.querySelectorAll('app-service-card img'));
    expect(photos.map((img) => img.getAttribute('alt'))).toEqual([
      'Calipers and a bearing on a drawing',
      'A desk with charts',
      'A technician wiring a box',
    ]);
    for (const img of photos) {
      expect(img.getAttribute('loading')).toBe('lazy');
      expect(img.getAttribute('width')).toBeTruthy();
      expect(img.getAttribute('height')).toBeTruthy();
    }
    expect(
      element.querySelectorAll('app-ladder-figure svg[aria-hidden="true"]').length
    ).toBe(1);
    expect(element.querySelector('swiper-container')).toBeNull();
  });

  describe('lamp test', () => {
    it('runs on the first visit of a session and remembers it', () => {
      create();
      expect(component.testing).toBeTrue();
      expect(element.querySelector('app-mimic')?.classList).toContain('is-testing');
      expect(sessionStorage.getItem(LAMP_TEST_STORAGE_KEY)).toBe('1');
    });

    it('does not run again within the same session', () => {
      sessionStorage.setItem(LAMP_TEST_STORAGE_KEY, '1');
      create();
      expect(component.testing).toBeFalse();
      expect(element.querySelector('app-mimic')?.classList).not.toContain(
        'is-testing'
      );
    });

    it('is skipped when sessionStorage is blocked', () => {
      const unblock = blockStorage('sessionStorage');
      create();
      expect(component.testing).toBeFalse();
      expect(element.querySelector('app-mimic')?.classList).not.toContain(
        'is-testing'
      );
      unblock();
    });

    it('is skipped under reduced motion', () => {
      spyOn(window, 'matchMedia').and.returnValue({
        matches: true,
      } as MediaQueryList);
      create();
      expect(component.testing).toBeFalse();
      expect(element.querySelector('app-mimic')?.classList).not.toContain(
        'is-testing'
      );
      expect(sessionStorage.getItem(LAMP_TEST_STORAGE_KEY)).toBeNull();
    });
  });
});
