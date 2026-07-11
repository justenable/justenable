import { TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { TitledText } from '../models/titled-text.model';
import { UtilsService } from './utils.service';

describe('UtilsService', () => {
  let service: UtilsService;
  let translate: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideTranslateService()],
    });
    service = TestBed.inject(UtilsService);
    translate = TestBed.inject(TranslateService);
    translate.use('en');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('splits "Title: text" entries and sorts keys numerically', () => {
    translate.setTranslation(
      'en',
      {
        'LIST.10': 'Tenth: last entry',
        'LIST.0': 'First: leading entry',
        'LIST.2': 'Second: with: extra colon',
        'OTHER.0': 'Noise: should be ignored',
      },
      true
    );

    let result: TitledText[] = [];
    service.streamTitledList('LIST').subscribe((items) => (result = items));

    expect(result.map((item) => item.title)).toEqual([
      'First',
      'Second',
      'Tenth',
    ]);
    expect(result[0].text).toBe('leading entry');
    expect(result[1].text).toBe('with: extra colon');
  });

  it('re-emits translated entries when the language changes', () => {
    translate.setTranslation('en', { 'LIST.0': 'Hello: world' }, true);
    translate.setTranslation('fr', { 'LIST.0': 'Bonjour: le monde' }, true);

    let result: TitledText[] = [];
    service.streamTitledList('LIST').subscribe((items) => (result = items));
    expect(result[0].title).toBe('Hello');

    translate.use('fr');
    expect(result[0]).toEqual({ title: 'Bonjour', text: 'le monde' });
  });
});
