import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProcessFigureComponent } from './process-figure.component';

describe('ProcessFigureComponent', () => {
  let fixture: ComponentFixture<ProcessFigureComponent>;
  let svg: SVGSVGElement;

  beforeEach(() => {
    TestBed.configureTestingModule({ declarations: [ProcessFigureComponent] });
    fixture = TestBed.createComponent(ProcessFigureComponent);
    fixture.detectChanges();
    svg = fixture.nativeElement.querySelector('svg');
  });

  it('is decorative, landscape and drawn in ink', () => {
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.getAttribute('viewBox')).toBe('0 0 480 300');
    expect(svg.getAttribute('stroke')).toBe('currentColor');
    expect(svg.getAttribute('stroke-width')).toBe('1.5');
  });

  it('carries only tags as text', () => {
    const texts = Array.from(svg.querySelectorAll('text'));
    expect(texts.map((text) => text.textContent)).toEqual(['REQUEST', 'CHECK', 'APPROVE', 'FILE']);
    for (const text of texts) {
      expect(text.classList).toContain('figure-tag');
    }
  });

  it('lights exactly one element', () => {
    expect(svg.querySelectorAll('.figure-marker').length).toBe(1);
  });

  it('draws the automated path solid and the manual bypass dotted', () => {
    const dotted = svg.querySelectorAll('[stroke-dasharray]');
    expect(dotted.length).toBe(1);
    expect(svg.querySelectorAll('rect.face').length).toBe(4);
  });

  it('lays the flow on two rows so it fills the frame', () => {
    const rows = new Set(
      Array.from(svg.querySelectorAll('rect.face'), (rect) => rect.getAttribute('y'))
    );
    expect(Array.from(rows)).toEqual(['72', '192']);
  });
});
