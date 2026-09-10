import { isPlatformBrowser } from '@angular/common';
import { inject, NgModule, PLATFORM_ID, provideAppInitializer } from '@angular/core';
import { BrowserModule, provideClientHydration, withNoIncrementalHydration } from '@angular/platform-browser';

import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { firstValueFrom } from 'rxjs';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LanguageSwitcherComponent } from './components/language-switcher/language-switcher.component';
import { SkipLinkComponent } from './components/skip-link/skip-link.component';
import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';
import { SiteFooterComponent } from './layout/site-footer/site-footer.component';
import { SiteHeaderComponent } from './layout/site-header/site-header.component';
import { resolveInitialLang } from './shared/languages';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    SkipLinkComponent,
    SiteHeaderComponent,
    SiteFooterComponent,
    LanguageSwitcherComponent,
    ThemeToggleComponent,
  ],
  imports: [AppRoutingModule.forRoot(), BrowserModule, SharedModule],
  providers: [
    provideTranslateService({
      fallbackLang: 'en',
      loader: provideTranslateHttpLoader({
        prefix: './assets/i18n/',
        suffix: '.json',
      }),
    }),
    // Translations are loaded before the first render so the hydrating
    // render has the same structure as the prerendered English HTML (text
    // nodes are swapped in place; hydration validates node types, not text).
    // Without hydration the prerendered DOM is thrown away at bootstrap and
    // every route collapses to header + footer until the route chunk lands.
    provideAppInitializer(() => {
      const translate = inject(TranslateService);
      const isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
      return firstValueFrom(translate.use(resolveInitialLang(translate, isBrowser)));
    }),
    provideClientHydration(withNoIncrementalHydration()),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
