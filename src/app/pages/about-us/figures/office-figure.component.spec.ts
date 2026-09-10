import { ComponentFixture, TestBed } from '@angular/core/testing';
import { drawOrder, steps } from './figure-draw.spec-helpers';
import { OfficeFigureComponent } from './office-figure.component';

describe('OfficeFigureComponent', () => {
  let fixture: ComponentFixture<OfficeFigureComponent>;
  let svg: SVGSVGElement;

  beforeEach(() => {
    TestBed.configureTestingModule({ declarations: [OfficeFigureComponent] });
    fixture = TestBed.createComponent(OfficeFigureComponent);
    fixture.detectChanges();
    svg = fixture.nativeElement.querySelector('svg');
  });

  it('is a decorative landscape drawing hidden from assistive technology', () => {
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.getAttribute('viewBox')).toBe('0 0 480 288');
    expect(svg.classList).toContain('w-full');
  });

  it('tags the three areas and the north arrow in mono', () => {
    const tags = Array.from(svg.querySelectorAll('text.figure-tag')).map(
      (text) => text.textContent?.trim()
    );
    expect(tags).toEqual(['DESKS', 'COURT', 'BRAAI', 'N']);
  });

  it('lights only the coals of the braai', () => {
    const accents = svg.querySelectorAll('.figure-accent');
    expect(accents.length).toBe(1);
    expect(accents[0].tagName).toBe('circle');
    expect(accents[0].getAttribute('cx')).toBe('416');
    expect(accents[0].getAttribute('cy')).toBe('152');
  });

  it('draws every line through the figure draw-in contract, in document order', () => {
    const lines = Array.from(svg.querySelectorAll<SVGElement>('.figure-line'));
    expect(lines.length).toBe(29);
    const order = drawOrder(lines);
    for (let i = 1; i < order.length; i++) {
      expect(order[i]).withContext(`element ${i}`).toBeGreaterThanOrEqual(order[i - 1]);
    }
    expect(steps(svg)).toBe(Math.max(...order));
  });

  it('fades the coals in after the lines rather than drawing them', () => {
    const coals = svg.querySelector('.figure-accent');
    expect(coals?.hasAttribute('pathLength')).toBeFalse();
  });
});
