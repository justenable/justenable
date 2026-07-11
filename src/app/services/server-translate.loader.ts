import { Injectable } from '@angular/core';
import { TranslateLoader, TranslationObject } from '@ngx-translate/core';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Observable, of } from 'rxjs';

// The http loader cannot resolve './assets/i18n/*.json' during prerendering
// (no origin to resolve relative URLs against), so the server pass reads the
// translation files straight from the filesystem.
@Injectable()
export class ServerTranslateLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<TranslationObject> {
    const path = join(process.cwd(), 'src', 'assets', 'i18n', `${lang}.json`);
    return of(JSON.parse(readFileSync(path, 'utf-8')) as TranslationObject);
  }
}
