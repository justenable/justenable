import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { Router, TitleStrategy } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { TranslatedTitleStrategy } from './translated-title.strategy';

@Component({
    template: '',
    standalone: false
})
class DummyComponent {}

describe('TranslatedTitleStrategy', () => {
  let router: Router;
  let translate: TranslateService;
  let title: Title;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: 'about-us',
            component: DummyComponent,
            title: 'PAGE_TITLE.ABOUT_US',
          },
        ]),
      ],
      providers: [
        provideTranslateService(),
        { provide: TitleStrategy, useClass: TranslatedTitleStrategy },
      ],
    });
    router = TestBed.inject(Router);
    translate = TestBed.inject(TranslateService);
    title = TestBed.inject(Title);
    translate.use('en');
    translate.setTranslation(
      'en',
      { 'PAGE_TITLE.ABOUT_US': 'About Us' },
      true
    );
    translate.setTranslation(
      'fr',
      { 'PAGE_TITLE.ABOUT_US': 'Qui sommes-nous' },
      true
    );
  });

  it('sets a translated title suffixed with the site name', async () => {
    await router.navigateByUrl('/about-us');
    expect(title.getTitle()).toBe('About Us | Just Enable');
  });

  it('re-applies the title when the language changes', async () => {
    await router.navigateByUrl('/about-us');
    translate.use('fr');
    expect(title.getTitle()).toBe('Qui sommes-nous | Just Enable');
  });

  it('keeps the canonical link in sync with the route', async () => {
    await router.navigateByUrl('/about-us');
    const canonical = document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]'
    );
    expect(canonical?.getAttribute('href')).toContain('/about-us');
  });
});
