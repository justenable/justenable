import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, map } from 'rxjs';
import { TitledText } from '../models/titled-text.model';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor(private translate: TranslateService) {}

  /**
   * Streams the numbered entries stored under flat keys like
   * `${prefix}.0`, `${prefix}.1`, ... as "Title: text" strings,
   * split into structured items. Re-emits on language change.
   */
  public streamTitledList(prefix: string): Observable<TitledText[]> {
    // stream() is only used as a "translations loaded / language changed"
    // signal; the values are read from the store because the i18n files
    // use flat dotted keys, so the prefix itself resolves to nothing.
    return this.translate.stream(prefix).pipe(
      map(() => {
        const lang = this.translate.currentLang || this.translate.defaultLang;
        const translations = this.translate.translations[lang] || {};
        return Object.keys(translations)
          .filter((key) => key.startsWith(prefix + '.'))
          .sort(
            (a, b) =>
              Number(a.slice(prefix.length + 1)) -
              Number(b.slice(prefix.length + 1))
          )
          .map((key) => this.splitTitledText(translations[key]));
      })
    );
  }

  private splitTitledText(value: string): TitledText {
    return {
      title: value.substring(0, value.indexOf(':')),
      text: value.substring(value.indexOf(':') + 1).trim(),
    };
  }
}
