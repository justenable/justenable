import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expectDrawContract } from './figure.spec-helpers';
import { IntegrationFigureComponent } from './integration-figure.component';

describe('IntegrationFigureComponent', () => {
  let fixture: ComponentFixture<IntegrationFigureComponent>;
  let svg: SVGSVGElement;

  beforeEach(() => {
    TestBed.configureTestingModule({ declarations: [IntegrationFigureComponent] });
    fixture = TestBed.createComponent(IntegrationFigureComponent);
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
    expect(texts.map((text) => text.textContent)).toEqual(['ERP', 'MES', 'LIMS', 'REPORT']);
    for (const text of texts) {
      expect(text.classList).toContain('figure-tag');
    }
  });

  it('draws every stroke in order under the draw-in contract', () => {
    expectDrawContract(svg);
  });

  it('flies the record on a group of its own, so the marker keeps its fade-in', () => {
    expect(svg.querySelector('g.bus-record > .figure-marker')).not.toBeNull();
  });

  it('lights exactly one element', () => {
    expect(svg.querySelectorAll('.figure-marker').length).toBe(1);
  });

  it('joins three sources and two outputs to one bus', () => {
    expect(svg.querySelectorAll('.bus').length).toBe(1);
    expect(svg.querySelectorAll('.dot').length).toBe(5);
    expect(svg.querySelectorAll('ellipse').length).toBe(3);
  });
});
