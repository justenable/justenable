import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(() => {
    localStorage.removeItem('lang');
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [provideTranslateService()],
      declarations: [AppComponent],
      // app-header / app-footer / app-theme-switcher are stubbed out at
      // the shell level; they have their own specs.
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
  });

  afterEach(() => localStorage.removeItem('lang'));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('activates the stored language on init', () => {
    localStorage.setItem('lang', 'fr');
    const translate = TestBed.inject(TranslateService);
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(translate.getCurrentLang()).toBe('fr');
  });

  it('falls back to english for unsupported stored languages', () => {
    localStorage.setItem('lang', 'xx');
    const translate = TestBed.inject(TranslateService);
    spyOn(translate, 'getBrowserLang').and.returnValue('de');
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(translate.getCurrentLang()).toBe('en');
  });

  it('persists language changes and updates the html lang attribute', () => {
    const translate = TestBed.inject(TranslateService);
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    translate.use('zu');

    expect(localStorage.getItem('lang')).toBe('zu');
    expect(document.documentElement.lang).toBe('zu');
  });
});
