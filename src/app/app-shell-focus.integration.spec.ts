import { provideLocationMocks } from '@angular/common/testing';
import { ApplicationRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { stubViewTransition } from 'src/testing/view-transition';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// RouterScroller (anchorScrolling) is started by the router's
// APP_BOOTSTRAP_LISTENER, which TestBed.createComponent never fires, so this
// case bootstraps the shell through ApplicationRef like the real app does.
// Importing the real AppRoutingModule is what makes a change to its router
// options fail this test.
describe('App shell focus management (integration)', () => {
  let host: HTMLElement;
  const settle = async (appRef: ApplicationRef) => {
    await appRef.whenStable();
    // RouterScroller emits Scroll on a macrotask after NavigationEnd.
    await new Promise<void>((resolve) => setTimeout(resolve));
    await appRef.whenStable();
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [AppRoutingModule.forRoot()],
      providers: [
        provideLocationMocks(),
        provideTranslateService(),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
    stubViewTransition();
    host = document.createElement('app-root');
    document.body.appendChild(host);
  });

  afterEach(() => host.remove());

  it('moves focus to the H2 on a contents-row click and back to main on the next path navigation', async () => {
    const appRef = TestBed.inject(ApplicationRef);
    appRef.bootstrap(AppComponent, host);
    // Let the initial navigation land: the first NavigationEnd never moves focus.
    await settle(appRef);
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/automation');
    await settle(appRef);
    const main = host.querySelector('main#main');
    expect(document.activeElement).withContext('after path navigation').toBe(main);

    const link = host.querySelector<HTMLAnchorElement>('nav[aria-label] a[href$="#a-02"]');
    expect(link?.getAttribute('href')).toBe('/automation#a-02');
    link!.click();
    await settle(appRef);
    expect(router.url).toBe('/automation#a-02');
    expect(document.activeElement)
      .withContext('after contents click')
      .toBe(host.querySelector('h2#a-02'));

    await router.navigateByUrl('/maintenance');
    await settle(appRef);
    expect(document.activeElement).withContext('after next path navigation').toBe(main);
  });

  // The router's anchor scrolling ignores CSS scroll-margin and measures the
  // target as transformed, so both the offset it uses and the target's
  // reveal state are checked here, against the real stylesheet.
  it('lands a fragment target at the offset h2[id] declares, shown at once', async () => {
    const appRef = TestBed.inject(ApplicationRef);
    appRef.bootstrap(AppComponent, host);
    await settle(appRef);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/automation');
    await settle(appRef);

    const heading = host.querySelector<HTMLElement>('h2#a-02')!;
    const offset = parseFloat(getComputedStyle(heading).scrollMarginTop);
    expect(offset).toBe(80);
    const scrollTo = spyOn(window, 'scrollTo');

    host.querySelector<HTMLAnchorElement>('nav[aria-label] a[href$="#a-02"]')!.click();
    await settle(appRef);

    expect(heading.closest('section')?.classList).not.toContain('reveal');
    const { top } = scrollTo.calls.mostRecent().args[0] as ScrollToOptions;
    expect(top).toBe(heading.getBoundingClientRect().top + window.pageYOffset - offset);
  });
});
