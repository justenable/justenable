import { Component, PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, RouterModule } from '@angular/router';
import {
  provideTranslateService,
  TranslatePipe,
  TranslateService,
} from '@ngx-translate/core';
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

describe('SectionRailComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let element: HTMLElement;

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
});
