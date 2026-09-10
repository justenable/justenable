import { ViewportScroller } from '@angular/common';
import {
  DOCUMENT,
  inject,
  ModuleWithProviders,
  NgModule,
  provideAppInitializer,
} from '@angular/core';
import {
  provideRouter,
  Router,
  RouterModule,
  Routes,
  TitleStrategy,
  ViewTransitionInfo,
  withInMemoryScrolling,
  withViewTransitions,
} from '@angular/router';
import { TranslatedTitleStrategy } from './services/translated-title.strategy';

const routes: Routes = [
  {
    path: 'about-us',
    title: 'NAVIGATION.ABOUT_US',
    loadChildren: () =>
      import('./pages/about-us/about-us.module').then((m) => m.AboutUsModule),
  },
  {
    path: 'automation',
    title: 'NAVIGATION.AUTOMATION',
    loadChildren: () =>
      import('./pages/automation/automation.module').then(
        (m) => m.AutomationModule
      ),
  },
  {
    path: '',
    // Without pathMatch: 'full' the empty path prefix-matches every URL, so
    // the routes listed after it would load HomeModule before backtracking.
    pathMatch: 'full',
    title: 'NAVIGATION.HOME',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'maintenance',
    title: 'NAVIGATION.MAINTENANCE',
    loadChildren: () =>
      import('./pages/maintenance/maintenance.module').then(
        (m) => m.MaintenanceModule
      ),
  },
  {
    path: 'contact-us',
    title: 'NAVIGATION.CONTACT_US',
    loadChildren: () =>
      import('./pages/contact-us/contact-us.module').then(
        (m) => m.ContactUsModule
      ),
  },
  {
    path: '**',
    title: 'NOT_FOUND.TITLE',
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
  },
];

/**
 * The cross-fade means "the page you leave fades into the page you open". A
 * contents-row link only changes the fragment, so no page is left and the
 * transition is skipped; anchorScrolling still jumps to the heading.
 */
function skipFragmentOnlyTransition({ transition }: ViewTransitionInfo): void {
  const router = inject(Router);
  const target = router.getCurrentNavigation()?.finalUrl;
  if (
    target &&
    router.isActive(target, {
      paths: 'exact',
      matrixParams: 'exact',
      queryParams: 'ignored',
      fragment: 'ignored',
    })
  ) {
    transition.skipTransition();
  }
}

/**
 * The router's anchor scrolling positions a fragment target from its own
 * offset and ignores CSS scroll-margin, so it reads the token h2[id] uses
 * (tokens.scss) and a heading lands in the same place whether the browser
 * or the router scrolled to it. Read at scroll time, not at start-up: the
 * stylesheet need not have loaded yet.
 */
function useAnchorOffset(): void {
  const document = inject(DOCUMENT);
  inject(ViewportScroller).setOffset(() => [
    0,
    parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue('--anchor-offset')
    ),
  ]);
}

@NgModule({
  imports: [RouterModule],
  exports: [RouterModule],
})
export class AppRoutingModule {
  /**
   * Router providers are created here, per application, rather than in the
   * decorator: provideRouter rather than RouterModule.forRoot because the
   * forRoot options can switch view transitions on but cannot skip the
   * first one, and on a hydrated page that first transition would fade the
   * prerendered content out and back in. The skip is a one-shot flag inside
   * the providers, so building them once per bundle would let whichever
   * spec navigates first consume it. The styles live in src/styles.scss.
   */
  static forRoot(): ModuleWithProviders<AppRoutingModule> {
    return {
      ngModule: AppRoutingModule,
      providers: [
        provideRouter(
          routes,
          withInMemoryScrolling({
            anchorScrolling: 'enabled',
            scrollPositionRestoration: 'top',
          }),
          withViewTransitions({
            skipInitialTransition: true,
            onViewTransitionCreated: skipFragmentOnlyTransition,
          })
        ),
        { provide: TitleStrategy, useClass: TranslatedTitleStrategy },
        provideAppInitializer(useAnchorOffset),
      ],
    };
  }
}
