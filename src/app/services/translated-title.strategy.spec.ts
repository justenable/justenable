import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { provideRouter, Router, TitleStrategy } from '@angular/router';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { TranslatedTitleStrategy } from './translated-title.strategy';

@Component({
  template: '',
  standalone: false,
})
class DummyComponent {}

describe('TranslatedTitleStrategy', () => {
  let router: Router;
  let translate: TranslateService;
  let title: Title;
  let meta: Meta;

  const canonical = (): string | null | undefined =>
    document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.getAttribute('href');

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      providers: [
        provideRouter([
          { path: 'about-us', component: DummyComponent, title: 'PAGE_TITLE.ABOUT_US' },
          { path: '**', component: DummyComponent, title: 'NOT_FOUND.TITLE' },
        ]),
        provideTranslateService(),
        { provide: TitleStrategy, useClass: TranslatedTitleStrategy },
      ],
    });
    router = TestBed.inject(Router);
    translate = TestBed.inject(TranslateService);
    title = TestBed.inject(Title);
    meta = TestBed.inject(Meta);
    translate.use('en');
    translate.setTranslation(
      'en',
      { 'PAGE_TITLE.ABOUT_US': 'About Us', 'NOT_FOUND.TITLE': 'Page not found' },
      true
    );
    translate.setTranslation(
      'fr',
      { 'PAGE_TITLE.ABOUT_US': 'Qui sommes-nous' },
      true
    );
  });

  afterEach(() => {
    document.head.querySelector('link[rel="canonical"]')?.remove();
    meta.removeTag('name="robots"');
    meta.removeTag('property="og:url"');
    meta.removeTag('property="og:title"');
    meta.removeTag('name="twitter:title"');
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

  it('mirrors the title into the social preview tags', async () => {
    await router.navigateByUrl('/about-us');
    expect(meta.getTag('property="og:title"')?.content).toBe('About Us | Just Enable');
    expect(meta.getTag('name="twitter:title"')?.content).toBe('About Us | Just Enable');
  });

  it('keeps the canonical link and og:url in sync with the route', async () => {
    await router.navigateByUrl('/about-us');
    expect(canonical()).toContain('/about-us');
    expect(meta.getTag('property="og:url"')?.content).toContain('/about-us');
    expect(meta.getTag('name="robots"')).toBeNull();
  });

  it('marks unknown routes noindex without a canonical URL', async () => {
    await router.navigateByUrl('/about-us');
    await router.navigateByUrl('/no-such-page');
    expect(title.getTitle()).toBe('Page not found | Just Enable');
    expect(meta.getTag('name="robots"')?.content).toBe('noindex');
    expect(canonical()).toBeUndefined();
    expect(meta.getTag('property="og:url"')).toBeNull();

    await router.navigateByUrl('/about-us');
    expect(meta.getTag('name="robots"')).toBeNull();
    expect(canonical()).toContain('/about-us');
  });
});
