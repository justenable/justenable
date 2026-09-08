import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RackFigureComponent } from './rack-figure.component';

describe('RackFigureComponent', () => {
  let fixture: ComponentFixture<RackFigureComponent>;
  let svg: SVGSVGElement;

  beforeEach(() => {
    TestBed.configureTestingModule({ declarations: [RackFigureComponent] });
    fixture = TestBed.createComponent(RackFigureComponent);
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
    expect(texts.map((text) => text.textContent)).toEqual(['> provision', '> deploy', 'U4', 'U3', 'U2', 'U1']);
    for (const text of texts) {
      expect(text.classList).toContain('figure-tag');
    }
  });

  it('lights exactly one element', () => {
    expect(svg.querySelectorAll('.figure-marker').length).toBe(1);
  });

  it('marks one of four units as the one being provisioned', () => {
    expect(svg.querySelectorAll('rect.face').length).toBe(4);
    expect(svg.querySelectorAll('.ring').length).toBe(3);
  });
});
