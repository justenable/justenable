import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  provideTranslateService,
  TranslatePipe,
  TranslateService,
} from '@ngx-translate/core';
import { INDUSTRY_KEYS, SERVICE_KEYS } from 'src/app/shared/catalogue';
import {
  MimicComponent,
  NODE_HREF,
  NODE_NAME_KEYS,
  NODES,
  TERMINAL_HREF,
  TERMINAL_NAME_KEYS,
  TERMINALS,
} from './mimic.component';

// index.html adds this before first paint unless the visitor prefers reduced motion.
const MOTION_CLASS = 'motion';

// The mimic legend and the about page's nameplate name the same four
// services and industries in the same order, so they read one list.
describe('MimicComponent legends', () => {
  it('names the services and industries from the shared catalogue', () => {
    expect(NODE_NAME_KEYS).toBe(SERVICE_KEYS);
    expect(TERMINAL_NAME_KEYS).toBe(INDUSTRY_KEYS);
    expect(NODE_NAME_KEYS.length).toBe(NODES.length);
    expect(TERMINAL_NAME_KEYS.length).toBe(TERMINALS.length);
  });
});

describe('MimicComponent', () => {
  let fixture: ComponentFixture<MimicComponent>;
  let element: HTMLElement;
  let images: SVGSVGElement[];

  const delays = (root: ParentNode, selector: string): string[] =>
    Array.from(root.querySelectorAll(selector)).map(
      (node) => getComputedStyle(node).animationDelay
    );

  const markForMotion = (): void => {
    document.documentElement.classList.add(MOTION_CLASS);
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MimicComponent],
      imports: [TranslatePipe],
      providers: [provideTranslateService()],
    });
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', {
      'HOME.MIMIC_TITLE': 'Plant overview',
      'HOME.MIMIC_DESC': 'Four services feed four industries.',
      'A11Y.MIMIC_LINKS': 'Services and industries are links.',
      'GLOBAL.DESIGN_ENGINEERING': 'Design engineering',
      'GLOBAL.SOFTWARE_ENGINEERING': 'Software engineering',
      'GLOBAL.PROJECT_MANAGEMENT': 'Project management',
      'GLOBAL.MAINTENANCE_AND_GENERAL_WORK': 'Maintenance and general work',
      'GLOBAL.FMCG': 'FMCG',
      'GLOBAL.PET': 'PET bottles',
      'GLOBAL.MINING': 'Mining',
      'GLOBAL.OIL_AND_GAS': 'Oil and gas',
    });
    translate.use('en');
    fixture = TestBed.createComponent(MimicComponent);
    element = fixture.nativeElement;
    fixture.detectChanges();
    images = Array.from(element.querySelectorAll('svg'));
  });

  afterEach(() => {
    document.documentElement.classList.remove(MOTION_CLASS);
  });

  it('renders the landscape and portrait variants as titled, described groups', () => {
    expect(images.length).toBe(2);
    for (const svg of images) {
      // Not an image: an image's children are presentational, which would
      // hide the anchors from assistive technology.
      expect(svg.getAttribute('role')).toBe('group');
      const title = svg.querySelector('title');
      const desc = svg.querySelector('desc');
      expect(title?.textContent).toBe('Plant overview');
      expect(desc?.textContent).toBe(
        'Four services feed four industries. Services and industries are links.'
      );
      expect(title?.id).toBeTruthy();
      expect(svg.getAttribute('aria-labelledby')).toBe(title?.id ?? '');
      expect(svg.getAttribute('aria-describedby')).toBe(desc?.id ?? '');
    }
    expect(images[0].classList).toContain('md:block');
    expect(images[0].classList).toContain('max-w-[640px]');
    expect(images[1].classList).toContain('md:hidden');
  });

  it('draws four service nodes feeding four lit terminals in each variant', () => {
    for (const svg of images) {
      const tags = Array.from(svg.querySelectorAll('text.mimic-tag')).map((text) =>
        text.textContent?.trim()
      );
      expect(tags.filter((tag) => tag?.startsWith('S'))).toEqual([...NODES]);
      expect(tags.filter((tag) => tag?.startsWith('X'))).toEqual([...TERMINALS]);
      expect(svg.querySelectorAll('.lamp-fill').length).toBe(4);
      expect(svg.querySelectorAll('.mimic-bus').length).toBe(1);
      expect(svg.querySelectorAll('.mimic-signal').length).toBe(4);
    }
  });

  it('makes every node and terminal an anchor to its home section, named after its legend', () => {
    for (const svg of images) {
      const anchors = Array.from(svg.querySelectorAll<SVGAElement>('a.mimic-node'));
      expect(anchors.length).toBe(8);
      // Tab order: the four services, then the four industries.
      expect(anchors.map((a) => a.getAttribute('href'))).toEqual([
        ...Array<string>(4).fill(NODE_HREF),
        ...Array<string>(4).fill(TERMINAL_HREF),
      ]);
      expect(NODE_HREF).toBe('#services');
      expect(TERMINAL_HREF).toBe('#industries');
      expect(anchors.map((a) => a.getAttribute('aria-label'))).toEqual([
        'S1 Design engineering',
        'S2 Software engineering',
        'S3 Project management',
        'S4 Maintenance and general work',
        'X1 FMCG',
        'X2 PET bottles',
        'X3 Mining',
        'X4 Oil and gas',
      ]);
      // Each anchor is the face and its tag, so the whole face is the target.
      for (const anchor of anchors) {
        expect(anchor.querySelectorAll('rect.mimic-face').length).toBe(1);
        expect(anchor.querySelectorAll('text.mimic-tag').length).toBe(1);
        expect(anchor.namespaceURI).toBe('http://www.w3.org/2000/svg');
      }
      expect(anchors.map((a) => a.querySelector('text')?.textContent?.trim())).toEqual([
        ...NODES,
        ...TERMINALS,
      ]);
    }
  });

  it('classes each lane so the stylesheet can light a selected path', () => {
    for (const svg of images) {
      for (const [i, node] of NODES.entries()) {
        const lane = node.toLowerCase();
        const terminal = TERMINALS[i].toLowerCase();
        expect(svg.querySelectorAll(`a.node--${lane}`).length).toBe(1);
        expect(svg.querySelectorAll(`a.node--${terminal}`).length).toBe(1);
        // The feeder is two segments (the run and the drop onto the bus).
        expect(svg.querySelectorAll(`line.mimic-feeder.feeder--${lane}`).length).toBe(2);
        expect(svg.querySelectorAll(`line.mimic-output.output--${terminal}`).length).toBe(1);
        expect(svg.querySelectorAll(`a.node--${terminal} rect.mimic-face--terminal`).length).toBe(
          1
        );
      }
      expect(svg.querySelectorAll('.mimic-feeder').length).toBe(8);
      expect(svg.querySelectorAll('.mimic-output').length).toBe(4);
      expect(svg.classList).toContain('mimic');
    }
  });

  it('normalises every line and signal so the animations can use one dash length', () => {
    const strokes = Array.from(element.querySelectorAll('line, .mimic-signal'));
    expect(strokes.length).toBe(34);
    for (const stroke of strokes) {
      expect(stroke.getAttribute('pathLength')).toBe('1');
    }
  });

  it('runs each signal along its feeder, from the S face to the bus dot', () => {
    const landscape = Array.from(images[0].querySelectorAll('.mimic-signal'));
    expect(landscape.map((path) => path.getAttribute('d'))).toEqual([
      'M112 56 H232 L240 64',
      'M112 120 H232 L240 128',
      'M112 184 H232 L240 192',
      'M112 248 H232 L240 256',
    ]);
    const portrait = Array.from(images[1].querySelectorAll('.mimic-signal'));
    expect(portrait.map((path) => path.getAttribute('d'))).toEqual([
      'M43 48 V120 L51 128',
      'M121 48 V120 L129 128',
      'M199 48 V120 L207 128',
      'M277 48 V120 L285 128',
    ]);
  });

  it('staggers the lamps and the signals by terminal index', () => {
    for (const svg of images) {
      for (const selector of ['.lamp-fill', '.mimic-signal']) {
        const nodes = Array.from(svg.querySelectorAll<SVGPathElement>(selector));
        expect(nodes.map((node) => node.style.getPropertyValue('--i'))).toEqual([
          '0',
          '1',
          '2',
          '3',
        ]);
      }
    }
  });

  it('is at its final lit state until the document is marked for motion', () => {
    const lamps = Array.from(element.querySelectorAll<SVGPathElement>('.lamp-fill'));
    const lines = Array.from(element.querySelectorAll<SVGLineElement>('.mimic-line'));
    const nodeTags = Array.from(element.querySelectorAll<SVGTextElement>('.mimic-tag--node'));
    const signals = Array.from(element.querySelectorAll<SVGPathElement>('.mimic-signal'));
    expect(lamps.length).toBe(8);
    expect(lines.length).toBeGreaterThan(0);
    expect(nodeTags.length).toBe(8);
    expect(signals.length).toBe(8);

    // Hidden start values live only in keyframes under html.motion, so HTML
    // without the pre-paint script and reduced motion show the finished picture.
    for (const lamp of lamps) {
      expect(getComputedStyle(lamp).animationName).toBe('none');
      expect(getComputedStyle(lamp).fillOpacity).toBe('1');
    }
    for (const line of lines) {
      expect(getComputedStyle(line).animationName).toBe('none');
      expect(getComputedStyle(line).strokeDashoffset).toBe('0px');
    }
    for (const tag of nodeTags) {
      expect(getComputedStyle(tag).opacity).toBe('1');
    }
    // The signal's rest state is "already passed": the dash sits beyond the feeder.
    for (const signal of signals) {
      expect(getComputedStyle(signal).animationName).toBe('none');
      expect(getComputedStyle(signal).strokeDashoffset).toBe('-1px');
    }

    markForMotion();

    // Section 6 timing: bus draws over --dur-draw, X1..X4 light 120ms apart, then the labels.
    for (const svg of images) {
      expect(delays(svg, '.lamp-fill')).toEqual(['0.5s', '0.62s', '0.74s', '0.86s']);
      // The signals follow the 1.1 s test, 150 ms apart.
      expect(delays(svg, '.mimic-signal')).toEqual(['1.1s', '1.25s', '1.4s', '1.55s']);
    }
    // Emulated encapsulation prefixes the keyframe names.
    for (const lamp of lamps) {
      expect(getComputedStyle(lamp).animationName).toMatch(/mimic-light$/);
      expect(getComputedStyle(lamp).animationFillMode).toBe('both');
    }
    for (const line of lines) {
      expect(getComputedStyle(line).animationName).toMatch(/mimic-draw$/);
      expect(getComputedStyle(line).animationDuration).toBe('0.5s');
      expect(getComputedStyle(line).animationDelay).toBe('0s');
      expect(getComputedStyle(line).strokeDasharray).toBe('1px');
    }
    for (const tag of nodeTags) {
      expect(getComputedStyle(tag).animationDelay).toBe('0.98s');
    }
    for (const signal of signals) {
      expect(getComputedStyle(signal).animationName).toMatch(/mimic-signal$/);
      expect(getComputedStyle(signal).animationDuration).toBe('1.2s');
      expect(getComputedStyle(signal).animationFillMode).toBe('both');
    }
  });

  it('shifts the whole test by --lamp-test-delay when the host sets one', () => {
    element.style.setProperty('--lamp-test-delay', '300ms');
    markForMotion();

    expect(delays(images[0], '.mimic-line')).toEqual(Array<string>(13).fill('0.3s'));
    expect(delays(images[0], '.lamp-fill')).toEqual(['0.8s', '0.92s', '1.04s', '1.16s']);
    expect(delays(images[0], '.mimic-tag--node')).toEqual(Array<string>(4).fill('1.28s'));
    expect(delays(images[0], '.mimic-signal')).toEqual(['1.4s', '1.55s', '1.7s', '1.85s']);
  });
});
