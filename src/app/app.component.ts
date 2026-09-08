import { isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  Component,
  DOCUMENT,
  inject,
  Injector,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs';
import { LayoutService } from './services/layout.service';
import { LANG_STORAGE_KEY, resolveInitialLang } from './shared/languages';
import { writeStorage } from './shared/storage';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  readonly layout = inject(LayoutService);

  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly injector = inject(Injector);
  private readonly router = inject(Router);
  private lastPath?: string;

  constructor(private translate: TranslateService) {}

  ngOnInit() {
    this.translate.onLangChange.subscribe(({ lang }) => {
      if (this.isBrowser) {
        writeStorage('local', LANG_STORAGE_KEY, lang);
      }
      this.document.documentElement.lang = lang;
    });
    // The app initializer has already loaded this language; ngx-translate
    // re-emits onLangChange for an active language, and that emission (after
    // the subscription above) is what sets <html lang> and the stored value.
    this.translate.use(resolveInitialLang(this.translate, this.isBrowser));

    if (this.isBrowser) {
      this.focusMainAfterNavigation();
    }
  }

  // Every navigation to another path moves focus to the main landmark so
  // keyboard and screen reader users start at the new page's content. The
  // router handles scrolling (scrollPositionRestoration: 'top'). A
  // fragment-only navigation on the same path (the contents-row anchors) is
  // left alone: anchorScrolling already scrolls to and focuses the H2, and
  // taking focus back to main would undo that.
  private focusMainAfterNavigation(): void {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        const path = event.urlAfterRedirects.split('#')[0];
        const pathChanged = this.lastPath !== undefined && path !== this.lastPath;
        this.lastPath = path;
        if (!pathChanged) {
          return;
        }
        // Wait for the render so main is no longer inert if the panel was open.
        afterNextRender(
          () =>
            this.document
              .getElementById('main')
              ?.focus({ preventScroll: true }),
          { injector: this.injector }
        );
      });
  }
}
