import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CONTACT } from 'src/app/shared/contact';
import { currentLanguage, LANGUAGES } from 'src/app/shared/languages';
import { NAV } from 'src/app/shared/navigation';
import { TAGLINES } from 'src/app/shared/taglines';

@Component({
  selector: 'app-site-footer',
  standalone: false,
  templateUrl: './site-footer.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./site-footer.component.scss'],
})
export class SiteFooterComponent {
  readonly nav = NAV;
  readonly contact = CONTACT;
  readonly year = new Date().getFullYear();
  // Fixed order (af, en, fr, sw, zu); the current language is highlighted, not moved.
  readonly taglines = LANGUAGES.map((language) => ({
    code: language.code,
    text: TAGLINES[language.code],
  }));
  readonly current = currentLanguage(inject(TranslateService));
}
