import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoopFigureComponent } from './loop-figure.component';

describe('LoopFigureComponent', () => {
  let fixture: ComponentFixture<LoopFigureComponent>;
  let svg: SVGSVGElement;

  beforeEach(() => {
    TestBed.configureTestingModule({ declarations: [LoopFigureComponent] });
    fixture = TestBed.createComponent(LoopFigureComponent);
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
    expect(texts.map((text) => text.textContent)).toEqual(['LT', 'PLC', 'CV']);
    for (const text of texts) {
      expect(text.classList).toContain('figure-tag');
    }
  });

  it('lights exactly one element', () => {
    expect(svg.querySelectorAll('.figure-marker').length).toBe(1);
  });

  it('runs two dashed signal lines through the PLC', () => {
    expect(svg.querySelectorAll('[stroke-dasharray="2 4"]').length).toBe(2);
  });
});
