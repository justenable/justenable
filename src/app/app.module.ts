import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideLottieOptions } from 'ngx-lottie';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { SharedModule } from './shared/shared.module';
import { ThemeSwitcherComponent } from './components/theme-switcher/theme-switcher.component';

export function playerFactory() {
  return import('lottie-web');
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ThemeSwitcherComponent,
  ],
  imports: [AppRoutingModule, BrowserModule, SharedModule],
  providers: [
    provideTranslateService({
      fallbackLang: 'en',
      loader: provideTranslateHttpLoader({
        prefix: './assets/i18n/',
        suffix: '.json',
      }),
    }),
    // No provideClientHydration: translations load asynchronously in the
    // browser, so the first client render cannot match the prerendered
    // English HTML; a full re-render on bootstrap avoids NG0500 mismatches.
    provideLottieOptions({ player: playerFactory }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
