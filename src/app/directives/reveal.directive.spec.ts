import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FakeIntersectionObserver } from 'src/testing/intersection-observer';
import { RevealDirective } from './reveal.directive';

@Component({
  template: `<section appReveal [appRevealDelay]="120">content</section>`,
  standalone: false,
})
class HostComponent {}

describe('RevealDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let section: HTMLElement;

  const observers = (): FakeIntersectionObserver[] => FakeIntersectionObserver.instances;

  // ngOnInit reads matchMedia, so the spy must precede fixture creation.
  function render(reducedMotion: boolean): void {
    spyOn(window, 'matchMedia').and.returnValue({
      matches: reducedMotion,
    } as MediaQueryList);
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    section = fixture.nativeElement.querySelector('section');
  }

  beforeEach(() => {
    FakeIntersectionObserver.install();
    TestBed.configureTestingModule({
      declarations: [RevealDirective, HostComponent],
    });
  });

  afterEach(() => FakeIntersectionObserver.restore());

  it('marks the element for reveal, applies the stagger delay and observes it', () => {
    render(false);
    expect(section.classList.contains('reveal')).toBeTrue();
    expect(section.style.getPropertyValue('--reveal-delay')).toBe('120ms');
    expect(observers().length).toBe(1);
    expect(observers()[0].init?.threshold).toBe(0.15);
    expect(observers()[0].observed).toEqual([section]);
  });

  it('reveals the element on its first intersection and then stops observing', () => {
    render(false);
    const observer = observers()[0];

    observer.trigger({ isIntersecting: false });
    expect(section.classList.contains('is-revealed')).toBeFalse();
    expect(observer.disconnect).not.toHaveBeenCalled();

    observer.trigger({ isIntersecting: true });
    expect(section.classList.contains('is-revealed')).toBeTrue();
    expect(observer.disconnect).toHaveBeenCalledTimes(1);
  });

  it('leaves the element visible and unobserved under reduced motion', () => {
    render(true);
    expect(section.classList.contains('reveal')).toBeFalse();
    expect(section.style.getPropertyValue('--reveal-delay')).toBe('');
    expect(observers().length).toBe(0);
  });

  it('disconnects the observer on destroy', () => {
    render(false);
    fixture.destroy();
    expect(observers()[0].disconnect).toHaveBeenCalledTimes(1);
  });
});
