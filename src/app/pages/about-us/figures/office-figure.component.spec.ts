import { ComponentFixture, TestBed } from '@angular/core/testing';
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
    expect(tags).toEqual(['N', 'DESKS', 'COURT', 'BRAAI']);
  });

  it('lights only the coals of the braai', () => {
    const accents = svg.querySelectorAll('.figure-accent');
    expect(accents.length).toBe(1);
    expect(accents[0].tagName).toBe('circle');
    expect(accents[0].getAttribute('cx')).toBe('416');
    expect(accents[0].getAttribute('cy')).toBe('152');
  });
});
