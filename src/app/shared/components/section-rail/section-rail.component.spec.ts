import { Component, PLATFORM_ID, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, RouterModule } from '@angular/router';
import {
  provideTranslateService,
  TranslatePipe,
  TranslateService,
} from '@ngx-translate/core';
import { SmoothViewportScroller } from 'src/app/services/smooth-viewport-scroller';
import { LampComponent } from 'src/app/shared/ui/lamp/lamp.component';
import { FakeIntersectionObserver } from 'src/testing/intersection-observer';
import { ContentsItem } from '../title-block/title-block.component';
import { RAIL_ROOT_MARGIN, SectionRailComponent } from './section-rail.component';

const ITEMS: ContentsItem[] = [
  { id: 'a-01', tag: 'A-01', key: 'GLOBAL.PROCESS_AUTOMATION' },
  { id: 'a-02', tag: 'A-02', key: 'GLOBAL.INDUSTRIAL_AUTOMATION' },
  { id: 'a-03', tag: 'A-03', key: 'GLOBAL.IT_INFRASTRUCTURE_AUTOMATION' },
  {
    id: 'a-05',
    tag: 'A-05',
    key: 'GLOBAL.AUTOMATION_OUTRO',
    params: { companyName: 'Just Enable' },
  },
];

// The headings the rail observes live outside it, in the page's sections.
@Component({
  template: `
    <app-section-rail [items]="items" />
    <h2 id="a-01">One</h2>
    <h2 id="a-02">Two</h2>
    <h2 id="a-03">Three</h2>
    <h2 id="a-05">Five</h2>
  `,
  standalone: false,
})
class HostComponent {
  items = ITEMS;
}

/**
 * Stands in for the router's scroller: the rail only needs to know whether a
 * scroll it started is still in flight.
 */
class StubScroller {
  readonly gliding = signal(false);
}

describe('SectionRailComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let element: HTMLElement;
  let scroller: StubScroller;

  const observers = (): FakeIntersectionObserver[] => FakeIntersectionObserver.instances;
  const links = (): HTMLAnchorElement[] => Array.from(element.querySelectorAll('nav a'));
  const litLamps = (): string[] =>
    links()
      .filter((link) => link.querySelector('.lamp--lit'))
      .map((link) => link.getAttribute('href') ?? '');
  const current = (): string[] =>
    links()
      .filter((link) => link.getAttribute('aria-current') === 'true')
      .map((link) => link.getAttribute('href') ?? '');

  // A heading "passes" when it reaches the line at 45% of the viewport and
  // stays passed while it is anywhere above it.
  function report(id: string, passed: boolean): void {
    observers()[0].trigger({
      target: element.querySelector(`#${id}`)!,
      isIntersecting: passed,
    });
    fixture.detectChanges();
  }

  function configure(platform: 'browser' | 'server'): void {
    TestBed.configureTestingModule({
      declarations: [SectionRailComponent, LampComponent, HostComponent],
      imports: [TranslatePipe, RouterModule],
      providers: [
        provideRouter([]),
        provideTranslateService(),
        { provide: PLATFORM_ID, useValue: platform },
        { provide: SmoothViewportScroller, useClass: StubScroller },
      ],
    });
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', {
      'A11Y.CONTENTS': 'On this page',
      'GLOBAL.PROCESS_AUTOMATION': 'Process automation',
      'GLOBAL.INDUSTRIAL_AUTOMATION': 'Industrial automation',
      'GLOBAL.IT_INFRASTRUCTURE_AUTOMATION': 'IT infrastructure automation',
      'GLOBAL.AUTOMATION_OUTRO': 'Partner with {{ companyName }} for automation excellence',
    });
    translate.use('en');
  }

  async function render(platform: 'browser' | 'server' = 'browser'): Promise<void> {
    configure(platform);
    scroller = TestBed.inject(SmoothViewportScroller) as unknown as StubScroller;
    fixture = TestBed.createComponent(HostComponent);
    element = fixture.nativeElement;
    fixture.detectChanges();
    // afterNextRender, where the observer is created, runs with the app's render.
    await fixture.whenStable();
    fixture.detectChanges();
  }

  beforeEach(() => FakeIntersectionObserver.install());

  afterEach(() => FakeIntersectionObserver.restore());

  it('renders one fragment link per item, with the tag and the name, in a labelled nav', async () => {
    await render();
    const nav = element.querySelector('nav');
    expect(nav?.getAttribute('aria-label')).toBe('On this page');
    expect(nav?.querySelector('ol')).not.toBeNull();
    expect(links().map((link) => link.getAttribute('href'))).toEqual([
      '/#a-01',
      '/#a-02',
      '/#a-03',
      '/#a-05',
    ]);
    expect(links()[0].textContent?.replace(/\s+/g, ' ').trim()).toBe(
      'A-01 Process automation'
    );
    // An anchor with an href is in the tab order; nothing else is needed.
    for (const link of links()) {
      expect(link.tabIndex).toBe(0);
    }
  });

  it('interpolates an item\'s params into its name, as the reason sheet titles need', async () => {
    await render();
    expect(links()[3].textContent?.replace(/\s+/g, ' ').trim()).toBe(
      'A-05 Partner with Just Enable for automation excellence'
    );
  });

  it('lights the first item until a heading has passed the line', async () => {
    await render();
    expect(litLamps()).toEqual(['/#a-01']);
    expect(current()).toEqual(['/#a-01']);
    expect(links()[0].classList).toContain('is-active');
  });

  it('observes every section heading against the upper-middle line', async () => {
    await render();
    expect(observers().length).toBe(1);
    const [observer] = observers();
    expect(observer.init?.threshold).toBe(0);
    expect(observer.init?.rootMargin).toBe(RAIL_ROOT_MARGIN);
    expect(observer.observed).toEqual(
      ITEMS.map((item) => element.querySelector(`#${item.id}`)!)
    );
  });

  it('lights the last section whose heading has passed the line, and only that one', async () => {
    await render();
    report('a-01', true);
    report('a-02', true);
    report('a-03', false);
    expect(litLamps()).toEqual(['/#a-02']);
    expect(current()).toEqual(['/#a-02']);
    expect(links().map((link) => link.classList.contains('is-active'))).toEqual([
      false,
      true,
      false,
      false,
    ]);
  });

  it('goes back to the previous section when a heading drops below the line again', async () => {
    await render();
    report('a-01', true);
    report('a-02', true);
    report('a-03', true);
    expect(litLamps()).toEqual(['/#a-03']);

    report('a-03', false);
    expect(litLamps()).toEqual(['/#a-02']);
    report('a-02', false);
    expect(litLamps()).toEqual(['/#a-01']);
  });

  it('falls back to the first section while every heading is below the line', async () => {
    await render();
    report('a-01', false);
    report('a-02', false);
    report('a-03', false);
    expect(litLamps()).toEqual(['/#a-01']);
    expect(current()).toEqual(['/#a-01']);
  });

  it('creates no observer on the server and lights the first item there', async () => {
    await render('server');
    expect(observers().length).toBe(0);
    expect(litLamps()).toEqual(['/#a-01']);
    expect(current()).toEqual(['/#a-01']);
  });

  it('disconnects the observer on destroy', async () => {
    await render();
    fixture.destroy();
    expect(observers()[0].disconnect).toHaveBeenCalledTimes(1);
  });

  // A rail link starts a smooth scroll that crosses every section in between,
  // and the observer reports each one. The rail must show the destination
  // throughout rather than running down the list.
  describe('while a glide it started is in flight', () => {
    /** Clicks a rail row the way a visitor does: the hold, then the scroll. */
    function clickRow(id: string): void {
      const link = links().find((a) => a.getAttribute('href') === `/#${id}`)!;
      link.click();
      scroller.gliding.set(true);
      fixture.detectChanges();
    }

    it('lights the destination in the same frame as the click', async () => {
      await render();
      clickRow('a-05');

      expect(litLamps()).toEqual(['/#a-05']);
      expect(current()).toEqual(['/#a-05']);
    });

    it('holds the destination while the sections it passes report in', async () => {
      await render();
      clickRow('a-05');

      report('a-01', true);
      expect(current()).toEqual(['/#a-05']);
      report('a-02', true);
      expect(current()).toEqual(['/#a-05']);
      report('a-03', true);
      expect(current()).toEqual(['/#a-05']);

      // Exactly one row is ever current, so a screen reader is never told
      // the page is in two places at once.
      expect(current().length).toBe(1);
    });

    it('settles on what the observer saw once the glide ends', async () => {
      await render();
      clickRow('a-05');
      report('a-01', true);
      report('a-02', true);
      report('a-03', true);
      report('a-05', true);

      scroller.gliding.set(false);
      fixture.detectChanges();

      expect(litLamps()).toEqual(['/#a-05']);
      expect(current()).toEqual(['/#a-05']);
    });

    // A glide that is clamped short of its target, or a visitor who scrolls
    // away mid-flight: the rail must tell the truth once it is over, not keep
    // the destination lit for ever.
    it('gives the row back to the observer when the glide lands elsewhere', async () => {
      await render();
      clickRow('a-05');
      report('a-01', true);
      report('a-02', true);
      expect(current()).toEqual(['/#a-05']);

      scroller.gliding.set(false);
      fixture.detectChanges();

      expect(litLamps()).toEqual(['/#a-02']);
      expect(current()).toEqual(['/#a-02']);
    });

    it('follows the observer again after the glide, with no hold left behind', async () => {
      await render();
      clickRow('a-03');
      scroller.gliding.set(false);
      fixture.detectChanges();

      report('a-01', true);
      expect(current()).toEqual(['/#a-01']);
      report('a-02', true);
      expect(current()).toEqual(['/#a-02']);
    });

    it('drops the hold when the items change', async () => {
      await render();
      clickRow('a-05');
      expect(current()).toEqual(['/#a-05']);

      fixture.componentInstance.items = [...ITEMS];
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(current()).toEqual(['/#a-01']);
    });
  });
});
