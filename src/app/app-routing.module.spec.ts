import { provideLocationMocks } from '@angular/common/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { stubViewTransition } from 'src/testing/view-transition';
import { AppRoutingModule } from './app-routing.module';

describe('AppRoutingModule', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppRoutingModule.forRoot()],
      providers: [provideLocationMocks(), provideTranslateService()],
    });
  });

  it('runs a view transition for every navigation after the first', async () => {
    const startViewTransition = stubViewTransition();
    const router = TestBed.inject(Router);

    // The first navigation is the prerendered page hydrating: the visitor is
    // already looking at it, so nothing may fade. forRoot() builds the
    // providers for this TestBed alone, so no other spec has used the skip.
    await router.navigateByUrl('/automation');
    expect(startViewTransition).not.toHaveBeenCalled();

    await router.navigateByUrl('/maintenance');
    expect(startViewTransition).toHaveBeenCalledTimes(1);
  });

  it('skips the transition when only the fragment changes, and keeps it between paths', async () => {
    const startViewTransition = stubViewTransition();
    const router = TestBed.inject(Router);
    const lastTransition = (): ViewTransition => startViewTransition.calls.mostRecent().returnValue;
    await router.navigateByUrl('/automation');

    // A contents-row link: the page stays, the heading scrolls into view.
    await router.navigateByUrl('/automation#a-02');
    expect(startViewTransition).toHaveBeenCalledTimes(1);
    expect(lastTransition().skipTransition).toHaveBeenCalledTimes(1);

    await router.navigateByUrl('/maintenance');
    expect(startViewTransition).toHaveBeenCalledTimes(2);
    expect(lastTransition().skipTransition).not.toHaveBeenCalled();
  });
});
