import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { map, Observable } from 'rxjs';
import { INDUSTRY_KEYS, SERVICE_KEYS } from 'src/app/shared/catalogue';
import { CONTACT } from 'src/app/shared/contact';

/**
 * Sets the names of one engraved row on a single line. The space before
 * the dot does not break, so a wrapped row ends with the dot rather than
 * starting its next line with one.
 */
export const NAME_SEPARATOR = '\u00a0· ';

/**
 * The engraved nameplate on the "Our story" row: the mark and six facts
 * (company, motto, location, contact, services, industries). Every value
 * comes from CONTACT or a translation key; the last two rows list names the
 * home page already carries. Nothing is invented (no revision, date or
 * drawn-by).
 */
@Component({
  selector: 'app-nameplate',
  templateUrl: './nameplate.component.html',
  styleUrl: './nameplate.component.scss',
  standalone: false,
})
export class NameplateComponent {
  readonly company = 'Just Enable';
  readonly email = CONTACT.email;
  readonly location = CONTACT.locality;
  readonly services$ = this.namesOnOneLine(SERVICE_KEYS);
  readonly industries$ = this.namesOnOneLine(INDUSTRY_KEYS);

  constructor(private translate: TranslateService) {}

  /** The translated names joined in the given order; re-emits on language change. */
  private namesOnOneLine(keys: readonly string[]): Observable<string> {
    return this.translate.stream([...keys]).pipe(
      map((names: Record<string, string>) =>
        keys.map((key) => names[key]).join(NAME_SEPARATOR)
      )
    );
  }
}
