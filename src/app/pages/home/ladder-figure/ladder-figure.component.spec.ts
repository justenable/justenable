import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LadderFigureComponent } from './ladder-figure.component';

describe('LadderFigureComponent', () => {
  let fixture: ComponentFixture<LadderFigureComponent>;
  let svg: SVGSVGElement;

  beforeEach(() => {
    TestBed.configureTestingModule({ declarations: [LadderFigureComponent] });
    fixture = TestBed.createComponent(LadderFigureComponent);
    fixture.detectChanges();
    svg = fixture.nativeElement.querySelector('svg');
  });

  it('is decorative and hidden from assistive technology', () => {
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.getAttribute('viewBox')).toBe('0 0 400 300');
  });

  it('labels the rails, contacts, timer and coils in mono', () => {
    const labels = Array.from(svg.querySelectorAll('text.label')).map(
      (text) => text.textContent
    );
    expect(labels).toEqual(['L+', 'M', 'I0.0', 'T1', 'TON', 'Q0.0', 'I0.1', 'Q0.1']);
  });

  it('lights only the first rung coil', () => {
    expect(svg.querySelectorAll('.coil').length).toBe(4);
    expect(svg.querySelectorAll('.coil--lit').length).toBe(2);
  });
});
