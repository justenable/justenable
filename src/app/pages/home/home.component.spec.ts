import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { SITE_INDEX } from 'src/app/shared/site-index';
import { HomeComponent, INDEX_STAGGER } from './home.component';
import { LadderFigureComponent } from './ladder-figure/ladder-figure.component';
import {
  MimicComponent,
  NODE_NAME_KEYS,
  NODES,
  TERMINAL_NAME_KEYS,
  TERMINALS,
} from './mimic/mimic.component';
import { ServiceCardComponent } from './service-card/service-card.component';

// index.html adds this before first paint unless the visitor prefers reduced motion.
const MOTION_CLASS = 'motion';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let element: HTMLElement;

  function create(): void {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  }

  // RevealDirective reads the media query itself.
  function reduceMotion(): void {
    spyOn(window, 'matchMedia').and.returnValue({
      matches: true,
    } as MediaQueryList);
  }

  // What a reduced-motion visitor's document looks like: never marked.
  function withoutMotion(): void {
    document.documentElement.classList.remove(MOTION_CLASS);
  }

  const animationDelays = (selector: string): string[] =>
    Array.from(element.querySelectorAll(selector)).map(
      (node) => getComputedStyle(node).animationDelay
    );

  const revealDelays = (selector: string): string[] =>
    Array.from(element.querySelectorAll<HTMLElement>(selector)).map((node) =>
      node.style.getPropertyValue('--reveal-delay')
    );

  beforeEach(() => {
    document.documentElement.classList.add(MOTION_CLASS);
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
      'A11Y.MIMIC_LINKS': 'Services and industries are links.',
      'HOME.INDEX_TITLE': 'Everything we do',
      'NAVIGATION.AUTOMATION': 'Automation',
      'NAVIGATION.MAINTENANCE': 'Maintenance',
      'GLOBAL.PROCESS_AUTOMATION': 'Process automation',
      'GLOBAL.FACILITY_MAINTENACE': 'Facility maintenance',
      'IMG.DESIGN_ENGINEERING_ALT': 'Calipers and a bearing on a drawing',
      'IMG.PROJECT_MANAGEMENT_ALT': 'A desk with charts',
      'IMG.MAINTENANCE_ALT': 'A technician wiring a box',
    });
    translate.use('en');
  });

  afterEach(() => {
    document.documentElement.classList.remove(MOTION_CLASS);
  });

  it('defines the four services S1 to S4 with their media', () => {
    create();
    const tags = component.services.map((service) => service.tag);
    expect(tags).toEqual(['S1', 'S2', 'S3', 'S4']);
    // The cards are the legend of the mimic's service nodes.
    expect(tags).toEqual([...NODES]);
    expect(component.services.map((service) => service.titleKey)).toEqual([
      ...NODE_NAME_KEYS,
    ]);
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
    expect(component.industries.map((industry) => industry.nameKey)).toEqual([
      ...TERMINAL_NAME_KEYS,
    ]);
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
      'index',
    ]);
    for (const heading of sections) {
      expect(
        element.querySelector(`section[aria-labelledby="${heading.id}"]`)
      ).not.toBeNull();
      // Fragment targets (the mimic anchors point here): the router focuses
      // the H2 after scrolling, which only works when it is focusable.
      expect(heading.getAttribute('tabindex')).withContext(heading.id).toBe('-1');
    }
    expect(element.querySelectorAll('h3').length).toBe(8);
  });

  it('splits the hero evenly between the text and the mimic from lg', () => {
    create();
    const text = element.querySelector('section.hero h1')?.parentElement;
    expect(text?.classList).toContain('lg:col-span-6');
    expect(element.querySelector('app-mimic')?.classList).toContain('lg:col-span-6');
  });

  it('renders the mimic as a titled and described group', () => {
    create();
    const groups = Array.from(element.querySelectorAll('app-mimic svg[role="group"]'));
    expect(groups.length).toBe(2);
    for (const svg of groups) {
      expect(svg.querySelector('title')?.textContent).toBe('Plant overview');
      expect(svg.querySelector('desc')?.textContent).toBe(
        'Four services feed four industries. Services and industries are links.'
      );
    }
    expect(element.querySelectorAll('app-mimic').length).toBe(1);
  });

  it('links the hero buttons and the CTA band to the other pages', () => {
    create();
    const links = Array.from(element.querySelectorAll('.hero__actions a[href]'));
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '/contact-us',
      '/automation',
      '/maintenance',
    ]);
    expect(element.querySelector('app-cta-band a[href="/contact-us"]')).not.toBeNull();
  });

  it('points every mimic anchor at an H2 of this page', () => {
    create();
    const anchors = Array.from(element.querySelectorAll('app-mimic a.mimic-node'));
    // Eight per variant, and both variants are in the DOM.
    expect(anchors.length).toBe(16);
    const hrefs = new Set(anchors.map((anchor) => anchor.getAttribute('href') ?? ''));
    expect([...hrefs]).toEqual(['#services', '#industries']);
    for (const href of hrefs) {
      expect(element.querySelector(`h2${href}`)).withContext(href).not.toBeNull();
    }
  });

  describe('site index', () => {
    const links = (): HTMLAnchorElement[] =>
      Array.from(element.querySelectorAll('.site-index a.site-index__link'));

    it('lists every numbered section of the two service pages as a deep link', () => {
      create();
      expect(links().length).toBe(9);
      expect(links().map((link) => link.getAttribute('href'))).toEqual([
        '/automation#a-01',
        '/automation#a-02',
        '/automation#a-03',
        '/automation#a-04',
        '/maintenance#m-01',
        '/maintenance#m-02',
        '/maintenance#m-03',
        '/maintenance#m-04',
        '/maintenance#m-05',
      ]);
      const expected = SITE_INDEX.flatMap((page) =>
        page.sections.map((section) => `${page.url}#${section.id}`)
      );
      expect(links().map((link) => link.getAttribute('href'))).toEqual(expected);
    });

    it('shows each row as its tag, its translated name and a trailing arrow', () => {
      create();
      const first = links()[0];
      expect(first.querySelector('.tag')?.textContent?.trim()).toBe('A-01');
      expect(first.textContent?.replace(/\s+/g, ' ').trim()).toBe('A-01 Process automation →');
      expect(first.querySelector('[aria-hidden="true"]')?.textContent).toBe('→');
      expect(first.classList).toContain('min-h-[48px]');
      // Body size at weight 500, the rail's active-row weight, not a heading.
      const name = first.querySelector('span:not(.tag):not([aria-hidden])') as HTMLElement;
      expect(name.textContent?.trim()).toBe('Process automation');
      expect(getComputedStyle(name).fontWeight).toBe('500');
      expect(getComputedStyle(name).fontSize).toBe('16px');
      const last = links()[8];
      expect(last.querySelector('.tag')?.textContent?.trim()).toBe('M-05');
      expect(last.textContent?.replace(/\s+/g, ' ').trim()).toBe('M-05 Facility maintenance →');
    });

    it('draws the focus ring inside the row, where the plate cannot clip it', () => {
      create();
      const first = links()[0];
      const last = links()[8];
      first.focus();
      expect(document.activeElement).toBe(first);
      expect(first.matches(':focus-visible')).toBeTrue();
      expect(getComputedStyle(first).outlineOffset).toBe('-2px');
      expect(getComputedStyle(first).outlineWidth).toBe('2px');
      expect(getComputedStyle(last).outlineOffset).not.toBe('-2px');
      first.blur();
    });

    it('labels each column list with the page name and sits on one plate', () => {
      create();
      const lists = Array.from(element.querySelectorAll('.site-index ul'));
      expect(lists.length).toBe(2);
      const labels = lists.map((list) => {
        const id = list.getAttribute('aria-labelledby') ?? '';
        return element.querySelector(`#${id}`)?.textContent?.trim();
      });
      expect(labels).toEqual(['Automation', 'Maintenance']);
      expect(lists.map((list) => list.getAttribute('aria-labelledby'))).toEqual([
        'index-automation',
        'index-maintenance',
      ]);
      expect(lists.map((list) => list.querySelectorAll('li').length)).toEqual([4, 5]);
      const plate = element.querySelector('.site-index');
      expect(plate?.classList).toContain('plate');
      expect(plate?.classList).toContain('p-0');
      expect(plate?.classList).toContain('md:grid-cols-2');
      expect(element.querySelector('section[aria-labelledby="index"] .tag--chip')?.textContent).toBe(
        'I'
      );
    });
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

  describe('scroll reveals', () => {
    it('staggers the service cards 80 ms and the industries cells 60 ms apart', () => {
      create();
      const cards = 'section[aria-labelledby="services"] li';
      const cells = 'li.terminal-cell';
      expect(element.querySelectorAll(`${cards}.reveal`).length).toBe(4);
      expect(element.querySelectorAll(`${cells}.reveal`).length).toBe(4);
      // The directive only writes a delay when there is one to write.
      expect(revealDelays(cards)).toEqual(['', '80ms', '160ms', '240ms']);
      expect(revealDelays(cells)).toEqual(['', '60ms', '120ms', '180ms']);
    });

    it('staggers the index rows 60 ms apart within each column', () => {
      create();
      expect(INDEX_STAGGER).toBe(60);
      const rows = '.site-index__row';
      expect(element.querySelectorAll(`${rows}.reveal`).length).toBe(9);
      expect(revealDelays(rows)).toEqual([
        '',
        '60ms',
        '120ms',
        '180ms',
        '',
        '60ms',
        '120ms',
        '180ms',
        '240ms',
      ]);
    });

    it('leaves the cards, cells and index rows as they are under reduced motion', () => {
      reduceMotion();
      create();
      expect(element.querySelectorAll('.reveal').length).toBe(0);
      expect(revealDelays('li')).toEqual(Array<string>(17).fill(''));
    });
  });

  describe('lamp test', () => {
    const heroAnimation = (): string =>
      getComputedStyle(element.querySelector('.hero__title') as HTMLElement).animationName;

    it('is pure CSS keyed on the document, so it runs on every visit', () => {
      create();
      // Emulated encapsulation prefixes the keyframe names.
      expect(heroAnimation()).toMatch(/hero-rise$/);
      expect(element.querySelector('section.hero')?.className).toBe('section hero');
      expect(element.querySelector('app-mimic')?.className).toBe('lg:col-span-6');

      fixture.destroy();
      create();
      expect(heroAnimation()).toMatch(/hero-rise$/);
      expect(animationDelays('app-mimic .mimic-line')).toEqual(
        Array<string>(26).fill('0.3s')
      );
    });

    it('is skipped when the document was not marked for motion', () => {
      withoutMotion();
      create();
      expect(heroAnimation()).toBe('none');
      expect(animationDelays('app-mimic .mimic-line')).toEqual(
        Array<string>(26).fill('0s')
      );
    });

    it('raises the hero text in order, then draws the mimic from 300 ms', () => {
      create();
      const rising = [
        '.hero__eyebrow',
        '.hero__title',
        '.hero__tagline',
        '.hero__actions',
      ].map((selector) => element.querySelector(selector) as HTMLElement);
      for (const node of rising) {
        expect(getComputedStyle(node).animationName).toMatch(/hero-rise$/);
        expect(getComputedStyle(node).animationDuration).toBe('0.48s');
        expect(getComputedStyle(node).animationFillMode).toBe('both');
      }
      expect(rising.map((node) => getComputedStyle(node).animationDelay)).toEqual([
        '0s',
        '0.08s',
        '0.32s',
        '0.4s',
      ]);
      const rule = element.querySelector('.hero__rule') as HTMLElement;
      expect(getComputedStyle(rule).animationName).toMatch(/hero-rule$/);
      expect(getComputedStyle(rule).animationDelay).toBe('0.24s');
      expect(getComputedStyle(rule).transformOrigin).toMatch(/^0px /);

      // The mimic's own timeline, shifted by the 300 ms the text takes to lead.
      expect(animationDelays('app-mimic .mimic-line')).toEqual(
        Array<string>(26).fill('0.3s')
      );
      expect(animationDelays('.mimic--landscape .lamp-fill')).toEqual([
        '0.8s',
        '0.92s',
        '1.04s',
        '1.16s',
      ]);
      expect(animationDelays('.mimic--landscape .mimic-signal')).toEqual([
        '1.4s',
        '1.55s',
        '1.7s',
        '1.85s',
      ]);
    });

    it('shows the finished hero with nothing animating without the motion class', () => {
      withoutMotion();
      reduceMotion();
      create();
      const nodes = Array.from(
        element.querySelectorAll<HTMLElement>(
          '.hero__eyebrow, .hero__title, .hero__rule, .hero__tagline, .hero__actions, app-mimic .mimic-line, app-mimic .lamp-fill, app-mimic .mimic-signal'
        )
      );
      expect(nodes.length).toBe(5 + 26 + 8 + 8);
      for (const node of nodes) {
        expect(getComputedStyle(node).animationName).toBe('none');
        expect(getComputedStyle(node).opacity).toBe('1');
      }
    });
  });
});
