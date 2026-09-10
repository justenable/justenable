import { ComponentFixture, TestBed } from '@angular/core/testing';
import { drawOrder, steps } from './figure-draw.spec-helpers';
import { StackFigureComponent } from './stack-figure.component';

describe('StackFigureComponent', () => {
  let fixture: ComponentFixture<StackFigureComponent>;
  let svg: SVGSVGElement;

  beforeEach(() => {
    TestBed.configureTestingModule({ declarations: [StackFigureComponent] });
    fixture = TestBed.createComponent(StackFigureComponent);
    fixture.detectChanges();
    svg = fixture.nativeElement.querySelector('svg');
  });

  it('is a decorative landscape drawing hidden from assistive technology', () => {
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.getAttribute('viewBox')).toBe('0 0 480 288');
    expect(svg.classList).toContain('w-full');
  });

  it('tags the three layers, bottom up, and the devices that carry a tag', () => {
    const tags = Array.from(svg.querySelectorAll('text.figure-tag')).map(
      (text) => text.textContent?.trim()
    );
    expect(tags).toEqual(['FIELD', 'M', 'CONTROL', 'PLC', 'SCADA', 'DIGITAL']);
  });

  it('draws the signal lines dashed', () => {
    const signals = svg.querySelectorAll('[stroke-dasharray="2 4"] line');
    expect(signals.length).toBe(5);
  });

  it('marks one signal in flight between the field and control layers', () => {
    const accents = svg.querySelectorAll('.figure-accent');
    expect(accents.length).toBe(1);
    expect(accents[0].tagName).toBe('circle');
    expect(accents[0].getAttribute('cx')).toBe('232');
    expect(accents[0].getAttribute('cy')).toBe('196');
  });

  it('draws the layers through the figure draw-in contract, from the ground up', () => {
    const lines = Array.from(
      svg.querySelectorAll<SVGElement>('.figure-line:not(.figure-dashed *)')
    );
    expect(lines.length).toBe(13);
    const order = drawOrder(lines);
    for (let i = 1; i < order.length; i++) {
      expect(order[i]).withContext(`element ${i}`).toBeGreaterThanOrEqual(order[i - 1]);
    }
    expect(steps(svg)).toBe(Math.max(...order));
  });

  it('fades the dashed signals and the measurement in after the layers instead of drawing them', () => {
    const later = svg.querySelectorAll('.figure-dashed line, .figure-accent');
    expect(later.length).toBe(6);
    for (const element of Array.from(later)) {
      expect(element.hasAttribute('pathLength')).withContext(element.outerHTML).toBeFalse();
    }
  });
});
