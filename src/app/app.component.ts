import {
  Component,
  DOCUMENT,
  inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

const SUPPORTED_LANGUAGES = ['en', 'fr', 'af', 'zu', 'sw'];
const LANG_STORAGE_KEY = 'lang';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent implements OnInit {
  title = 'justenable';

  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor(private translate: TranslateService) {}

  ngOnInit() {
    this.translate.onLangChange.subscribe(({ lang }) => {
      if (this.isBrowser) {
        localStorage.setItem(LANG_STORAGE_KEY, lang);
      }
      this.document.documentElement.lang = lang;
    });
    this.translate.use(this.resolveInitialLang());
  }

  private resolveInitialLang(): string {
    // Prerendered pages are always English; language preference only
    // exists in the browser.
    if (!this.isBrowser) {
      return 'en';
    }

    const stored = localStorage.getItem(LANG_STORAGE_KEY);
    if (stored && SUPPORTED_LANGUAGES.includes(stored)) {
      return stored;
    }

    const browserLang = this.translate.getBrowserLang();
    if (browserLang && SUPPORTED_LANGUAGES.includes(browserLang)) {
      return browserLang;
    }

    return 'en';
  }
}
