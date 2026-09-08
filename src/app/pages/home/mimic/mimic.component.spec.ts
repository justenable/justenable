import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  provideTranslateService,
  TranslatePipe,
  TranslateService,
} from '@ngx-translate/core';
import { MimicComponent, NODES, TERMINALS } from './mimic.component';

@Component({
  template: `<app-mimic [class.is-testing]="testing" />`,
  standalone: false,
})
class HostComponent {
  testing = false;
}

describe('MimicComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let element: HTMLElement;
  let images: SVGSVGElement[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MimicComponent, HostComponent],
      imports: [TranslatePipe],
      providers: [provideTranslateService()],
    });
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', {
      'HOME.MIMIC_TITLE': 'Plant overview',
      'HOME.MIMIC_DESC': 'Four services feed four industries.',
    });
    translate.use('en');
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
    images = Array.from(element.querySelectorAll('svg'));
  });

  it('renders the landscape and portrait variants as titled, described images', () => {
    expect(images.length).toBe(2);
    for (const svg of images) {
      expect(svg.getAttribute('role')).toBe('img');
      const title = svg.querySelector('title');
      const desc = svg.querySelector('desc');
      expect(title?.textContent).toBe('Plant overview');
      expect(desc?.textContent).toBe('Four services feed four industries.');
      expect(title?.id).toBeTruthy();
      expect(svg.getAttribute('aria-labelledby')).toBe(title?.id ?? '');
      expect(svg.getAttribute('aria-describedby')).toBe(desc?.id ?? '');
    }
    expect(images[0].classList).toContain('md:block');
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
    }
  });

  it('normalises every line so the draw animation can use one dash length', () => {
    const lines = Array.from(element.querySelectorAll('line'));
    expect(lines.length).toBeGreaterThan(0);
    for (const line of lines) {
      expect(line.getAttribute('pathLength')).toBe('1');
    }
  });

  it('staggers the lamps by terminal index', () => {
    for (const svg of images) {
      const lamps = Array.from(svg.querySelectorAll<SVGPathElement>('.lamp-fill'));
      expect(lamps.map((lamp) => lamp.style.getPropertyValue('--i'))).toEqual([
        '0',
        '1',
        '2',
        '3',
      ]);
    }
  });

  it('is at its final lit state unless the host runs the lamp test', () => {
    const lamps = Array.from(element.querySelectorAll<SVGPathElement>('.lamp-fill'));
    const lines = Array.from(element.querySelectorAll<SVGLineElement>('.mimic-line'));
    const nodeTags = Array.from(element.querySelectorAll<SVGTextElement>('.mimic-tag--node'));
    expect(lamps.length).toBe(8);
    expect(lines.length).toBeGreaterThan(0);
    expect(nodeTags.length).toBe(8);

    // Hidden start values live only in keyframes under .is-testing, so the
    // prerendered page and revisits show the finished picture.
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

    host.testing = true;
    fixture.detectChanges();

    // Section 6 timing: bus draws over --dur-draw, X1..X4 light 120ms apart, then the labels.
    for (const svg of images) {
      const svgLamps = Array.from(svg.querySelectorAll<SVGPathElement>('.lamp-fill'));
      expect(svgLamps.map((lamp) => getComputedStyle(lamp).animationDelay)).toEqual([
        '0.5s',
        '0.62s',
        '0.74s',
        '0.86s',
      ]);
    }
    // Emulated encapsulation prefixes the keyframe names.
    for (const lamp of lamps) {
      expect(getComputedStyle(lamp).animationName).toMatch(/mimic-light$/);
      expect(getComputedStyle(lamp).animationFillMode).toBe('both');
    }
    for (const line of lines) {
      expect(getComputedStyle(line).animationName).toMatch(/mimic-draw$/);
      expect(getComputedStyle(line).animationDuration).toBe('0.5s');
      expect(getComputedStyle(line).strokeDasharray).toBe('1px');
    }
    for (const tag of nodeTags) {
      expect(getComputedStyle(tag).animationDelay).toBe('0.98s');
    }
  });
});
