import { Location } from '@angular/common';
import { SpyLocation } from '@angular/common/testing';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HydrationService } from 'src/app/services/hydration.service';
import { FakeIntersectionObserver } from 'src/testing/intersection-observer';
import { REVEAL_BOTTOM_MARGIN, REVEAL_THRESHOLD, RevealDirective } from './reveal.directive';

@Component({
  template: `<section appReveal [appRevealDelay]="120">content</section>`,
  standalone: false,
})
class HostComponent {}

// A spacer taller than any viewport puts the section below the fold.
@Component({
  template: `
    <div style="height: 300vh"></div>
    <section appReveal>content</section>
  `,
  standalone: false,
})
class BelowFoldHostComponent {}

// Fixed to the viewport and placed from innerHeight, the measure the
// directive reads (the runner's 100vh is not the same number), so only a
// 20px sliver of the section shows above the fold.
@Component({
  template: `
    <section appReveal [style.top.px]="top" style="position: fixed; height: 200px">content</section>
  `,
  standalone: false,
})
class FoldHostComponent {
  readonly top = window.innerHeight - 20;
}

// A section holding a fragment target, below the fold like the others.
@Component({
  template: `
    <div style="height: 300vh"></div>
    <section appReveal><h2 id="m-04">Four</h2></section>
  `,
  standalone: false,
})
class TargetHostComponent {}

describe('RevealDirective', () => {
  let fixture: ComponentFixture<
    | HostComponent
    | BelowFoldHostComponent
    | FoldHostComponent
    | TargetHostComponent
  >;
  let location: SpyLocation;
  let section: HTMLElement;
  let hydrating: boolean;

  const observers = (): FakeIntersectionObserver[] => FakeIntersectionObserver.instances;

  // ngOnInit reads matchMedia, so the spy must precede fixture creation.
  function render(reducedMotion: boolean, host = HostComponent): void {
    spyOn(window, 'matchMedia').and.returnValue({
      matches: reducedMotion,
    } as MediaQueryList);
    fixture = TestBed.createComponent(host);
    fixture.detectChanges();
    section = fixture.nativeElement.querySelector('section');
  }

  beforeEach(() => {
    hydrating = false;
    FakeIntersectionObserver.install();
    TestBed.configureTestingModule({
      declarations: [
        RevealDirective,
        HostComponent,
        BelowFoldHostComponent,
        FoldHostComponent,
        TargetHostComponent,
      ],
      providers: [
        { provide: HydrationService, useValue: { hydrating: () => hydrating } },
        { provide: Location, useClass: SpyLocation },
      ],
    });
    location = TestBed.inject(Location) as unknown as SpyLocation;
  });

  afterEach(() => FakeIntersectionObserver.restore());

  it('marks the element for reveal, applies the stagger delay and observes it', () => {
    render(false);
    expect(section.classList.contains('reveal')).toBeTrue();
    expect(section.style.getPropertyValue('--reveal-delay')).toBe('120ms');
    expect(observers().length).toBe(1);
    expect(observers()[0].init?.threshold).toBe(REVEAL_THRESHOLD);
    expect(observers()[0].init?.rootMargin).toBe(`0px 0px -${REVEAL_BOTTOM_MARGIN}% 0px`);
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

  // Only the hiding is skipped: .reveal is what sets opacity 0, while
  // .is-revealed hides nothing and is what the figure draw-in and the
  // in-flight motions key on, so they must still run.
  it('never hides an element the visitor can already see while the prerendered page hydrates', () => {
    hydrating = true;
    render(false);
    expect(section.classList.contains('reveal')).toBeFalse();
    expect(section.style.getPropertyValue('--reveal-delay')).toBe('');
    expect(observers().length).toBe(0);
  });

  it('still marks that element revealed, so its motion plays', () => {
    hydrating = true;
    render(false);
    expect(section.classList.contains('is-revealed')).toBeTrue();
  });

  it('still reveals an element below the fold while the prerendered page hydrates', () => {
    hydrating = true;
    render(false, BelowFoldHostComponent);
    expect(section.getBoundingClientRect().top).toBeGreaterThan(window.innerHeight);
    expect(section.classList.contains('reveal')).toBeTrue();
    expect(observers()[0].observed).toEqual([section]);
  });

  it('still reveals an element that only just crosses the fold while hydrating', () => {
    hydrating = true;
    render(false, FoldHostComponent);
    // The placement is read from the style the directive measured: once
    // .reveal is on, the section also carries the 12px rise.
    const top = parseFloat(section.style.top);
    const { height } = section.getBoundingClientRect();
    expect(top).toBe(window.innerHeight - 20);
    expect((window.innerHeight - top) / height).toBeLessThan(REVEAL_THRESHOLD);
    expect(top).toBeGreaterThan(window.innerHeight * (1 - REVEAL_BOTTOM_MARGIN / 100));
    expect(section.classList.contains('reveal')).toBeTrue();
    expect(observers()[0].observed).toEqual([section]);
  });

  it('disconnects the observer on destroy', () => {
    render(false);
    fixture.destroy();
    expect(observers()[0].disconnect).toHaveBeenCalledTimes(1);
  });

  // The router scrolls to a fragment from the box as transformed, so the
  // section it points into must neither be hidden nor still rising then.
  describe('when the URL fragment points inside the element', () => {
    it('shows it at once when a same-page link changes the fragment', () => {
      render(false, TargetHostComponent);
      expect(section.classList.contains('reveal')).toBeTrue();

      location.go('/maintenance#m-04');
      expect(section.classList.contains('reveal')).toBeFalse();
      expect(section.classList.contains('is-revealed')).toBeFalse();
      expect(observers()[0].disconnect).toHaveBeenCalledTimes(1);
    });

    it('shows it at once when the page is reached with the fragment already set', async () => {
      location.go('/maintenance#m-04');
      render(false, TargetHostComponent);
      // The check waits for the render that binds the target's id.
      await fixture.whenStable();
      expect(section.classList.contains('reveal')).toBeFalse();
      expect(observers()[0].disconnect).toHaveBeenCalledTimes(1);
    });

    it('leaves an element the fragment does not point into alone', async () => {
      location.go('/maintenance#elsewhere');
      render(false, TargetHostComponent);
      await fixture.whenStable();
      location.go('/maintenance#nowhere');
      expect(section.classList.contains('reveal')).toBeTrue();
      expect(observers()[0].disconnect).not.toHaveBeenCalled();
    });
  });
});
