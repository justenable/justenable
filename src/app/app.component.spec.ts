import { Component, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { blockStorage } from 'src/testing/storage';
import { AppComponent } from './app.component';
import { LayoutService } from './services/layout.service';

@Component({ template: '', changeDetection: ChangeDetectionStrategy.Eager,
 standalone: true })
class PageStubComponent {}

describe('AppComponent', () => {
  beforeEach(() => {
    localStorage.removeItem('lang');
    TestBed.configureTestingModule({
      providers: [
        provideTranslateService(),
        provideRouter([
          { path: '', component: PageStubComponent },
          { path: 'automation', component: PageStubComponent },
        ]),
      ],
      declarations: [AppComponent],
      // app-skip-link / app-site-header / app-site-footer are stubbed out at
      // the shell level; they have their own specs.
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
  });

  afterEach(() => {
    localStorage.removeItem('lang');
    TestBed.inject(LayoutService).closeMenu();
  });

  it('renders skip link, header, main#main and footer in order', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const tags = Array.from((fixture.nativeElement as HTMLElement).children).map((child) =>
      child.tagName.toLowerCase()
    );
    expect(tags).toEqual(['app-skip-link', 'app-site-header', 'main', 'app-site-footer']);
    const main = fixture.nativeElement.querySelector('main');
    expect(main.id).toBe('main');
    expect(main.getAttribute('tabindex')).toBe('-1');
  });

  it('makes main and footer inert while the menu is open', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const main: HTMLElement = fixture.nativeElement.querySelector('main');
    const footer: HTMLElement = fixture.nativeElement.querySelector('app-site-footer');
    expect(main.hasAttribute('inert')).toBeFalse();
    expect(footer.hasAttribute('inert')).toBeFalse();

    TestBed.inject(LayoutService).openMenu();
    fixture.detectChanges();

    expect(main.hasAttribute('inert')).toBeTrue();
    expect(footer.hasAttribute('inert')).toBeTrue();
  });

  it('focuses main after every navigation except the first', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const router = TestBed.inject(Router);
    const main: HTMLElement = fixture.nativeElement.querySelector('main');
    document.body.appendChild(fixture.nativeElement);

    await router.navigateByUrl('/');
    fixture.detectChanges();
    expect(document.activeElement).not.toBe(main);

    await router.navigateByUrl('/automation');
    fixture.detectChanges();
    expect(document.activeElement).toBe(main);

    fixture.nativeElement.remove();
  });

  it('leaves focus alone for a fragment-only navigation on the same path', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const router = TestBed.inject(Router);
    const main: HTMLElement = fixture.nativeElement.querySelector('main');
    document.body.appendChild(fixture.nativeElement);
    // Stands in for the H2 that anchorScrolling focuses on a contents-row click.
    const heading = document.createElement('button');
    document.body.appendChild(heading);

    await router.navigateByUrl('/');
    await router.navigateByUrl('/automation');
    fixture.detectChanges();
    expect(document.activeElement).toBe(main);

    heading.focus();
    await router.navigateByUrl('/automation#a-02');
    fixture.detectChanges();
    expect(document.activeElement).toBe(heading);

    await router.navigateByUrl('/');
    fixture.detectChanges();
    expect(document.activeElement).toBe(main);

    heading.remove();
    fixture.nativeElement.remove();
  });

  it('focuses main after the panel that made it inert closes', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const router = TestBed.inject(Router);
    const layout = TestBed.inject(LayoutService);
    const main: HTMLElement = fixture.nativeElement.querySelector('main');
    document.body.appendChild(fixture.nativeElement);

    await router.navigateByUrl('/');
    fixture.detectChanges();
    // The header is stubbed here, so nothing closes the panel on NavigationEnd:
    // main stays inert through the navigation and focus() would be a no-op.
    layout.openMenu();
    fixture.detectChanges();
    await router.navigateByUrl('/automation');
    expect(main.hasAttribute('inert')).toBeTrue();

    layout.closeMenu();
    fixture.detectChanges();
    expect(main.hasAttribute('inert')).toBeFalse();
    expect(document.activeElement).toBe(main);

    fixture.nativeElement.remove();
  });

  it('activates the stored language on init', () => {
    localStorage.setItem('lang', 'fr');
    const translate = TestBed.inject(TranslateService);
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(translate.getCurrentLang()).toBe('fr');
  });

  it('uses the browser language when nothing is stored', () => {
    const translate = TestBed.inject(TranslateService);
    spyOn(translate, 'getBrowserLang').and.returnValue('fr');
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(translate.getCurrentLang()).toBe('fr');
  });

  it('falls back to the browser language when storage is blocked', () => {
    const unblock = blockStorage('localStorage');
    const translate = TestBed.inject(TranslateService);
    spyOn(translate, 'getBrowserLang').and.returnValue('sw');
    const fixture = TestBed.createComponent(AppComponent);
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(translate.getCurrentLang()).toBe('sw');
    expect(document.documentElement.lang).toBe('sw');
    unblock();
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
