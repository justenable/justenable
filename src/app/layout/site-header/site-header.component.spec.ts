import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router, RouterModule } from '@angular/router';
import { provideTranslateService, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LanguageSwitcherComponent } from 'src/app/components/language-switcher/language-switcher.component';
import { ThemeToggleComponent } from 'src/app/components/theme-toggle/theme-toggle.component';
import { ClickElsewhereDirective } from 'src/app/directives/click-elsewhere.directive';
import { LayoutService } from 'src/app/services/layout.service';
import { THEME_STORAGE_KEY } from 'src/app/services/theme.service';
import { LampComponent } from 'src/app/shared/ui/lamp/lamp.component';
import { LogoComponent } from 'src/app/shared/ui/logo/logo.component';
import { FOCUSABLE, SCROLLED_OFFSET, SiteHeaderComponent } from './site-header.component';

@Component({ template: '', standalone: true })
class PageStubComponent {}

describe('SiteHeaderComponent', () => {
  let fixture: ComponentFixture<SiteHeaderComponent>;
  let layout: LayoutService;
  let router: Router;

  const root = (): HTMLElement => fixture.nativeElement;
  const burger = (): HTMLButtonElement => root().querySelector('.burger')!;
  const panel = (): HTMLElement | null => root().querySelector('#site-menu');
  const panelFocusables = (): HTMLElement[] =>
    Array.from(panel()!.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (element) => element.tabIndex >= 0
    );

  function keydown(target: Element, key: string, shiftKey = false): KeyboardEvent {
    const event = new KeyboardEvent('keydown', { key, shiftKey, bubbles: true, cancelable: true });
    target.dispatchEvent(event);
    fixture.detectChanges();
    return event;
  }

  async function open(): Promise<void> {
    burger().click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  beforeEach(async () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'false');
    TestBed.configureTestingModule({
      declarations: [
        SiteHeaderComponent,
        LanguageSwitcherComponent,
        ThemeToggleComponent,
        LampComponent,
        LogoComponent,
        ClickElsewhereDirective,
      ],
      imports: [TranslatePipe, RouterModule],
      providers: [
        provideTranslateService(),
        provideRouter([
          { path: '', component: PageStubComponent },
          { path: 'automation', component: PageStubComponent },
          { path: 'contact-us', component: PageStubComponent },
        ]),
      ],
    });
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', {
      'A11Y.MAIN_NAVIGATION': 'Main',
      'A11Y.TOGGLE_NAVIGATION': 'Toggle navigation menu',
      'A11Y.CLOSE_MENU': 'Close menu',
      'A11Y.HOME_LINK': 'Just Enable, home',
      'NAVIGATION.HOME': 'Home',
      'NAVIGATION.AUTOMATION': 'Automation',
      'NAVIGATION.MAINTENANCE': 'Maintenance',
      'NAVIGATION.ABOUT_US': 'About us',
      'NAVIGATION.CONTACT_US': 'Contact us',
    });
    translate.use('en');
    layout = TestBed.inject(LayoutService);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(SiteHeaderComponent);
    fixture.detectChanges();
    await router.navigateByUrl('/');
    fixture.detectChanges();
  });

  afterEach(() => {
    layout.closeMenu();
    document.body.style.overflow = '';
    localStorage.removeItem(THEME_STORAGE_KEY);
    document.documentElement.classList.remove('dark');
  });

  it('renders the navigation from NAV with the current page lit and marked', () => {
    const links = Array.from(root().querySelectorAll<HTMLAnchorElement>('.site-header__list a'));
    expect(links.map((link) => link.textContent?.trim())).toEqual([
      'Home',
      'Automation',
      'Maintenance',
      'About us',
      'Contact us',
    ]);
    expect(links[0].getAttribute('aria-current')).toBe('page');
    expect(links[0].classList.contains('is-current')).toBeTrue();
    expect(links[0].querySelector('.lamp--lit')).not.toBeNull();
    expect(links[1].getAttribute('aria-current')).toBeNull();
    expect(links[1].querySelector('.lamp--lit')).toBeNull();
    expect(links[4].classList.contains('btn--primary')).toBeTrue();
    expect(links[4].querySelector('app-lamp')).toBeNull();
    expect(root().querySelector('nav')?.getAttribute('aria-label')).toBe('Main');
    expect(root().querySelector('.site-header__brand')?.getAttribute('aria-label')).toBe(
      'Just Enable, home'
    );
  });

  it('marks itself scrolled once the page has moved past the offset, and stops on destroy', () => {
    const scrollY = spyOnProperty(window, 'scrollY', 'get');
    const scroll = (to: number) => {
      scrollY.and.returnValue(to);
      window.dispatchEvent(new Event('scroll'));
    };

    scroll(SCROLLED_OFFSET + 1);
    expect(root().classList.contains('is-scrolled')).toBeTrue();
    scroll(SCROLLED_OFFSET);
    expect(root().classList.contains('is-scrolled')).toBeFalse();

    scroll(SCROLLED_OFFSET + 1);
    fixture.destroy();
    scroll(0);
    expect(root().classList.contains('is-scrolled')).toBeTrue();
  });

  it('marks the contact button current on /contact-us', async () => {
    await router.navigateByUrl('/contact-us');
    fixture.detectChanges();
    const contact = root().querySelector('.site-header__list .btn--primary')!;
    expect(contact.getAttribute('aria-current')).toBe('page');
    expect(contact.classList.contains('is-current')).toBeTrue();
  });

  it('wires the hamburger with aria-expanded, aria-controls and a state-aware label', async () => {
    // The panel does not exist while closed, so the IDREF must not dangle.
    expect(burger().getAttribute('aria-controls')).toBeNull();
    expect(burger().getAttribute('aria-expanded')).toBe('false');
    expect(burger().getAttribute('aria-label')).toBe('Toggle navigation menu');
    expect(panel()).toBeNull();

    await open();

    expect(layout.menuOpen()).toBeTrue();
    expect(burger().getAttribute('aria-expanded')).toBe('true');
    expect(burger().getAttribute('aria-controls')).toBe('site-menu');
    expect(burger().getAttribute('aria-label')).toBe('Close menu');
    expect(panel()).not.toBeNull();
    expect(document.body.style.overflow).toBe('hidden');
    expect(document.activeElement).toBe(panelFocusables()[0]);
  });

  it('renders panel rows, the primary button and the settings variants', async () => {
    await open();
    const rows = Array.from(panel()!.querySelectorAll<HTMLAnchorElement>('.site-menu__list a'));
    expect(rows.length).toBe(5);
    expect(rows[0].getAttribute('aria-current')).toBe('page');
    expect(rows[0].querySelector('.lamp--lit')).not.toBeNull();
    expect(rows[4].classList.contains('btn--primary')).toBeTrue();
    expect(panel()!.querySelector('[role="radiogroup"]')).not.toBeNull();
    expect(panel()!.querySelector('.rocker')?.getAttribute('aria-labelledby')).not.toBeNull();
  });

  it('closes on Escape and returns focus to the hamburger', async () => {
    await open();
    keydown(panelFocusables()[0], 'Escape');
    expect(layout.menuOpen()).toBeFalse();
    expect(panel()).toBeNull();
    expect(document.activeElement).toBe(burger());
    expect(document.body.style.overflow).toBe('');
  });

  it('traps Tab inside the panel in both directions', async () => {
    await open();
    const focusables = panelFocusables();
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    last.focus();
    const forward = keydown(last, 'Tab');
    expect(forward.defaultPrevented).toBeTrue();
    expect(document.activeElement).toBe(first);

    const backward = keydown(first, 'Tab', true);
    expect(backward.defaultPrevented).toBeTrue();
    expect(document.activeElement).toBe(last);

    focusables[1].focus();
    const middle = keydown(focusables[1], 'Tab');
    expect(middle.defaultPrevented).toBeFalse();
  });

  it('closes when a navigation ends', async () => {
    await open();
    await router.navigateByUrl('/automation');
    fixture.detectChanges();
    expect(layout.menuOpen()).toBeFalse();
    expect(panel()).toBeNull();
  });

  it('closes on an outside click but not on the hamburger itself', async () => {
    await open();
    burger().click();
    fixture.detectChanges();
    expect(layout.menuOpen()).toBeFalse();

    await open();
    document.body.click();
    fixture.detectChanges();
    expect(layout.menuOpen()).toBeFalse();
  });

  it('closes the panel when the viewport widens past the nav breakpoint', async () => {
    // The listener is registered in the constructor, so the header is rebuilt
    // with matchMedia spied; other queries (the theme's colour scheme) pass through.
    fixture.destroy();
    const matchMedia = window.matchMedia.bind(window);
    let onChange: ((event: { matches: boolean }) => void) | undefined;
    const navBar = {
      matches: false,
      addEventListener: (_type: string, listener: (event: { matches: boolean }) => void) => {
        onChange = listener;
      },
      removeEventListener: jasmine.createSpy('removeEventListener'),
    };
    spyOn(window, 'matchMedia').and.callFake((query: string) =>
      query === '(min-width: 1180px)' ? (navBar as unknown as MediaQueryList) : matchMedia(query)
    );
    fixture = TestBed.createComponent(SiteHeaderComponent);
    fixture.detectChanges();

    await open();
    expect(layout.menuOpen()).toBeTrue();
    expect(onChange).toBeDefined();

    onChange!({ matches: true });
    fixture.detectChanges();
    expect(layout.menuOpen()).toBeFalse();
    expect(panel()).toBeNull();
    expect(document.body.style.overflow).toBe('');

    fixture.destroy();
    expect(navBar.removeEventListener).toHaveBeenCalledWith('change', jasmine.any(Function));
  });
});
