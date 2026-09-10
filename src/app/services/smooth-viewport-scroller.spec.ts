import { DOCUMENT } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { stubReducedMotion } from 'src/testing/motion';
import {
  GLIDE_REST_MS,
  GLIDE_TIMEOUT_MS,
  SmoothViewportScroller,
} from './smooth-viewport-scroller';

describe('SmoothViewportScroller', () => {
  let scroller: SmoothViewportScroller;
  let document: Document;
  let heading: HTMLHeadingElement;
  let scrollTo: jasmine.Spy;
  let scrollY: number;
  let hashUnderTest = '';
  const extraHeadings: HTMLHeadingElement[] = [];

  /** Where the heading sits, so a spec can assert the landing arithmetic. */
  const HEADING_TOP = 1000;
  const ANCHOR_OFFSET = 80;

  function build(reduced: boolean): void {
    stubReducedMotion(reduced);
    TestBed.configureTestingModule({ providers: [SmoothViewportScroller] });
    document = TestBed.inject(DOCUMENT);
    scroller = TestBed.inject(SmoothViewportScroller);
    scroller.setOffset([0, ANCHOR_OFFSET]);
  }

  beforeEach(() => {
    scrollY = 0;
    heading = document?.createElement('h2') ?? window.document.createElement('h2');
  });

  function addHeading(id: string, viewportTop: number): HTMLHeadingElement {
    const el = document.createElement('h2');
    el.id = id;
    el.tabIndex = -1;
    document.body.appendChild(el);
    extraHeadings.push(el);
    spyOn(el, 'getBoundingClientRect').and.returnValue({
      top: viewportTop,
    } as DOMRect);
    return el;
  }

  function stubWindow(): void {
    scrollTo = spyOn(window, 'scrollTo');
    spyOnProperty(window, 'scrollY', 'get').and.callFake(() => scrollY);
  }

  /**
   * The service reads the fragment from location.hash, which the karma page
   * owns, so it is set for real and put back afterwards.
   */
  function setHash(hash: string): void {
    hashUnderTest = hash;
    window.location.hash = hash;
  }

  afterEach(() => {
    heading.remove();
    for (const el of extraHeadings.splice(0)) {
      el.remove();
    }
    if (hashUnderTest) {
      hashUnderTest = '';
      // Assigning '' leaves a bare '#'; replaceState clears it outright.
      window.history.replaceState(null, '', window.location.pathname);
    }
  });

  describe('with motion allowed', () => {
    beforeEach(() => {
      build(false);
      stubWindow();
      heading = addHeading('a-03', HEADING_TOP);
    });

    it('glides to the anchor offset above the heading, and never sideways', () => {
      scroller.scrollToAnchor('a-03');

      // top only: the element's own rect.left would ask for a horizontal
      // scroll no page here can satisfy.
      expect(scrollTo).toHaveBeenCalledWith({
        top: HEADING_TOP - ANCHOR_OFFSET,
        behavior: 'smooth',
      });
    });

    it('measures the target from the current scroll position, not the viewport', () => {
      scrollY = 400;
      scroller.scrollToAnchor('a-03');

      expect(scrollTo).toHaveBeenCalledWith({
        top: HEADING_TOP + 400 - ANCHOR_OFFSET,
        behavior: 'smooth',
      });
    });

    // The defect this class exists to fix: BrowserViewportScroller focuses the
    // anchor without preventScroll, and that focus scroll aborts the smooth
    // one roughly 400px short of the heading.
    it('focuses the heading without letting focus scroll the page', () => {
      const focus = spyOn(heading, 'focus');
      scroller.scrollToAnchor('a-03');

      expect(focus).toHaveBeenCalledWith({ preventScroll: true });
    });

    it('glides to a position and reports the glide while it runs', fakeAsync(() => {
      expect(scroller.gliding()).toBeFalse();

      scroller.scrollToPosition([0, 600], { behavior: 'smooth' });
      expect(scrollTo).toHaveBeenCalledWith({
        top: 600,
        left: 0,
        behavior: 'smooth',
      });
      expect(scroller.gliding()).toBeTrue();

      // Still moving: the offset changes between polls.
      scrollY = 200;
      tick(50);
      expect(scroller.gliding()).toBeTrue();
      scrollY = 600;
      tick(50);
      expect(scroller.gliding()).toBeTrue();

      // Arrived: one poll at the same offset, then the quiet period.
      tick(50);
      tick(GLIDE_REST_MS);
      expect(scroller.gliding()).toBeFalse();
    }));

    // The shape the router actually uses for a forward navigation to a new
    // page: no options at all. Gliding here would drag the page you are
    // leaving up the screen under the page you opened, so the default for a
    // whole-page move is instant even though anchors glide.
    it('jumps instantly for the top of a new page, which the router asks for with no options', () => {
      scroller.scrollToPosition([0, 0]);

      expect(scrollTo).toHaveBeenCalledWith({
        top: 0,
        left: 0,
        behavior: 'instant',
      });
      expect(scroller.gliding()).toBeFalse();
    });

    it('still glides to a position when a caller asks for it', () => {
      scroller.scrollToPosition([0, 600], { behavior: 'smooth' });

      expect(scrollTo).toHaveBeenCalledWith({
        top: 600,
        left: 0,
        behavior: 'smooth',
      });
      expect(scroller.gliding()).toBeTrue();
    });

    // Back to /automation#a-03: scrollPositionRestoration 'top' asks for
    // [0, 0] on popstate before anchorScrolling can act, which would leave
    // the heading the visitor navigated back to far off screen.
    describe('restoring a popstate position whose URL names a heading', () => {
      it('lands on the heading rather than the top of the page', () => {
        setHash('#a-03');
        scroller.scrollToPosition([0, 0], { behavior: 'instant' });

        expect(scrollTo).toHaveBeenCalledWith({
          top: HEADING_TOP - ANCHOR_OFFSET,
          behavior: 'instant',
        });
      });

      it('decodes a percent-encoded fragment', () => {
        addHeading('a b', 500);
        setHash('#a%20b');
        scroller.scrollToPosition([0, 0], { behavior: 'instant' });

        expect(scrollTo).toHaveBeenCalledWith({
          top: 500 - ANCHOR_OFFSET,
          behavior: 'instant',
        });
      });

      it('goes to the top when the fragment matches no element', () => {
        setHash('#nowhere');
        scroller.scrollToPosition([0, 0], { behavior: 'instant' });

        expect(scrollTo).toHaveBeenCalledWith({
          top: 0,
          left: 0,
          behavior: 'instant',
        });
      });

      // scrollPositionRestoration 'enabled' hands back the offset the
      // visitor actually left, which is the truth even on a page whose URL
      // carries a fragment.
      it('honours a real restored offset instead of the fragment', () => {
        setHash('#a-03');
        scroller.scrollToPosition([0, 250], { behavior: 'instant' });

        expect(scrollTo).toHaveBeenCalledWith({
          top: 250,
          left: 0,
          behavior: 'instant',
        });
      });
    });

    // A target the browser clamps (below the last scrollable pixel) never
    // reaches the requested offset, so rest must not be the only way out.
    it('gives up on a glide that never arrives', fakeAsync(() => {
      scroller.scrollToPosition([0, 99999], { behavior: 'smooth' });
      expect(scroller.gliding()).toBeTrue();

      tick(GLIDE_TIMEOUT_MS);
      expect(scroller.gliding()).toBeFalse();
      // The give-up must not leave a poll running.
      tick(1000);
      expect(scroller.gliding()).toBeFalse();
    }));

    it('reads the offset from the function it was given, at scroll time', () => {
      let offset = 80;
      scroller.setOffset(() => [0, offset]);
      scroller.scrollToAnchor('a-03');
      expect(scrollTo).toHaveBeenCalledWith({ top: 920, behavior: 'smooth' });

      offset = 120;
      scroller.scrollToAnchor('a-03');
      expect(scrollTo).toHaveBeenCalledWith({ top: 880, behavior: 'smooth' });
    });

    it('does nothing when the fragment matches no element', () => {
      scroller.scrollToAnchor('nowhere');
      expect(scrollTo).not.toHaveBeenCalled();
    });

    it('reports the current scroll position', () => {
      scrollY = 320;
      expect(scroller.getScrollPosition()[1]).toBe(320);
    });
  });

  describe('under prefers-reduced-motion: reduce', () => {
    beforeEach(() => {
      build(true);
      stubWindow();
      heading = addHeading('a-03', HEADING_TOP);
    });

    // The preference asks for the instant jump, and it must still land in
    // exactly the same place.
    it('jumps to the anchor instantly, at the same offset', () => {
      scroller.scrollToAnchor('a-03');

      expect(scrollTo).toHaveBeenCalledWith({
        top: HEADING_TOP - ANCHOR_OFFSET,
        behavior: 'instant',
      });
    });

    it('jumps to a position instantly and never reports a glide', fakeAsync(() => {
      scroller.scrollToPosition([0, 600]);

      expect(scrollTo).toHaveBeenCalledWith({
        top: 600,
        left: 0,
        behavior: 'instant',
      });
      expect(scroller.gliding()).toBeFalse();
      tick(GLIDE_TIMEOUT_MS);
      expect(scroller.gliding()).toBeFalse();
    }));

    // The preference is not merely the default: a caller asking for a glide
    // must not be able to talk a reduced-motion visitor into one.
    it('refuses a glide a caller asks for explicitly', fakeAsync(() => {
      scroller.scrollToPosition([0, 600], { behavior: 'smooth' });

      expect(scrollTo).toHaveBeenCalledWith({
        top: 600,
        left: 0,
        behavior: 'instant',
      });
      expect(scroller.gliding()).toBeFalse();
      tick(GLIDE_TIMEOUT_MS);
      expect(scroller.gliding()).toBeFalse();
    }));

    it('restores a popstate fragment instantly', () => {
      setHash('#a-03');
      scroller.scrollToPosition([0, 0], { behavior: 'instant' });

      expect(scrollTo).toHaveBeenCalledWith({
        top: HEADING_TOP - ANCHOR_OFFSET,
        behavior: 'instant',
      });
    });

    it('still focuses the heading without scrolling', () => {
      const focus = spyOn(heading, 'focus');
      scroller.scrollToAnchor('a-03');
      expect(focus).toHaveBeenCalledWith({ preventScroll: true });
    });
  });
});
