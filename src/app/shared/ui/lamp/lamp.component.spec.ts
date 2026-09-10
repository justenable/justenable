import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LampComponent } from './lamp.component';

@Component({
  template: `<app-lamp [lit]="lit" size="14" /><span>Label</span>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class HostComponent {
  lit = false;
}

describe('LampComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let svg: SVGSVGElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LampComponent, HostComponent],
    });
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    svg = fixture.nativeElement.querySelector('svg');
  });

  it('is hidden from assistive technology and sized from the input', () => {
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.getAttribute('width')).toBe('14');
    expect(svg.getAttribute('height')).toBe('14');
  });

  it('draws the astroid the mimic, the favicon and the mark derive from', () => {
    // Spec 4.19: the cross-workstream contract is this exact path.
    expect(svg.getAttribute('viewBox')).toBe('0 0 10 10');
    expect(svg.querySelector('path')?.getAttribute('d')).toBe(
      'M5 0 C5 3 3 5 0 5 C3 5 5 7 5 10 C5 7 7 5 10 5 C7 5 5 3 5 0 Z'
    );
  });

  it('toggles the lit class with the input', () => {
    expect(svg.classList.contains('lamp--lit')).toBeFalse();
    fixture.componentInstance.lit = true;
    fixture.detectChanges();
    expect(svg.classList.contains('lamp--lit')).toBeTrue();
  });
});
