import { ComponentFixture, TestBed } from '@angular/core/testing';
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

  it('tags the three layers and the devices that carry a tag', () => {
    const tags = Array.from(svg.querySelectorAll('text.figure-tag')).map(
      (text) => text.textContent?.trim()
    );
    expect(tags).toEqual(['DIGITAL', 'CONTROL', 'PLC', 'SCADA', 'FIELD', 'M']);
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
});
