import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, RouterModule } from '@angular/router';
import { provideTranslateService, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { RevealDirective } from 'src/app/directives/reveal.directive';
import { CONTACT } from 'src/app/shared/contact';
import { TAGLINES } from 'src/app/shared/taglines';
import { LogoComponent } from 'src/app/shared/ui/logo/logo.component';
import { FakeIntersectionObserver } from 'src/testing/intersection-observer';
import { stubReducedMotion } from 'src/testing/motion';
import { SiteFooterComponent } from './site-footer.component';

describe('SiteFooterComponent', () => {
  let fixture: ComponentFixture<SiteFooterComponent>;
  let translate: TranslateService;

  const root = (): HTMLElement => fixture.nativeElement;
  const taglines = (): HTMLLIElement[] => Array.from(root().querySelectorAll('.tagline-stack li'));

  beforeEach(() => {
    stubReducedMotion(false);
    FakeIntersectionObserver.install();
    TestBed.configureTestingModule({
      declarations: [SiteFooterComponent, LogoComponent, RevealDirective],
      imports: [TranslatePipe, RouterModule],
      providers: [provideTranslateService(), provideRouter([])],
    });
    translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', {
      'A11Y.FOOTER_NAVIGATION': 'Footer',
      'FOOTER.NAVIGATION': 'Navigation',
      'FOOTER.CONTACT': 'Contact',
      'FOOTER.ADDRESS': 'Address',
      'GLOBAL.OPEN_IN_MAPS': 'Open in Google Maps',
      'GLOBAL.NEW_WINDOW': '(opens in a new tab)',
      'NAVIGATION.HOME': 'Home',
      'NAVIGATION.AUTOMATION': 'Automation',
      'NAVIGATION.MAINTENANCE': 'Maintenance',
      'NAVIGATION.ABOUT_US': 'About us',
      'NAVIGATION.CONTACT_US': 'Contact us',
    });
    translate.use('en');
    fixture = TestBed.createComponent(SiteFooterComponent);
    fixture.detectChanges();
  });

  afterEach(() => FakeIntersectionObserver.restore());

  it('reveals the three columns 80 ms apart', () => {
    const columns = Array.from(root().querySelectorAll<HTMLElement>('.site-footer__columns > *'));
    expect(columns.length).toBe(3);
    expect(columns.every((column) => column.classList.contains('reveal'))).toBeTrue();
    expect(columns.map((column) => column.style.getPropertyValue('--reveal-delay'))).toEqual([
      '',
      '80ms',
      '160ms',
    ]);
  });

  it('renders the current year and the locale-invariant plate text', () => {
    const text = root().textContent ?? '';
    expect(text).toContain(`© ${new Date().getFullYear()} Just Enable.`);
    expect(text).toContain('PRETORIA · ZA');
  });

  it('stacks all five taglines in fixed order, each tagged with its language', () => {
    expect(taglines().map((item) => item.lang)).toEqual(['af', 'en', 'fr', 'sw', 'zu']);
    expect(taglines().map((item) => item.textContent?.trim())).toEqual([
      TAGLINES.af,
      TAGLINES.en,
      TAGLINES.fr,
      TAGLINES.sw,
      TAGLINES.zu,
    ]);
  });

  it('marks the current language tagline and follows language changes', () => {
    expect(taglines()[1].getAttribute('aria-current')).toBe('true');
    expect(taglines()[1].classList.contains('is-current')).toBeTrue();
    expect(taglines()[0].getAttribute('aria-current')).toBeNull();

    translate.use('zu');
    fixture.detectChanges();

    expect(taglines()[1].getAttribute('aria-current')).toBeNull();
    expect(taglines()[4].getAttribute('aria-current')).toBe('true');
  });

  it('renders the footer navigation from NAV as plain links', () => {
    const nav = root().querySelector('nav')!;
    expect(nav.getAttribute('aria-label')).toBe('Footer');
    const links = Array.from(nav.querySelectorAll<HTMLAnchorElement>('a'));
    expect(links.map((link) => link.textContent?.trim())).toEqual([
      'Home',
      'Automation',
      'Maintenance',
      'About us',
      'Contact us',
    ]);
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '/',
      '/automation',
      '/maintenance',
      '/about-us',
      '/contact-us',
    ]);
    expect(nav.querySelector('app-lamp')).toBeNull();
    expect(nav.querySelector('.btn')).toBeNull();
  });

  it('links the contact channels and the map with a new-tab note', () => {
    const hrefs = Array.from(
      root().querySelectorAll<HTMLAnchorElement>('.site-footer__columns a')
    ).map((link) => link.getAttribute('href'));
    expect(hrefs).toContain(`mailto:${CONTACT.email}`);
    expect(hrefs).toContain(CONTACT.phoneHref);
    expect(hrefs).toContain(CONTACT.mobileHref);

    const maps = root().querySelector<HTMLAnchorElement>('.site-footer__maps')!;
    expect(maps.getAttribute('href')).toBe(CONTACT.mapsUrl);
    expect(maps.getAttribute('target')).toBe('_blank');
    expect(maps.getAttribute('rel')).toBe('noopener');
    expect(maps.querySelector('.sr-only')?.textContent?.trim()).toBe('(opens in a new tab)');

    const address = root().querySelector('address')!;
    expect(address.getAttribute('lang')).toBe('en');
    expect(address.textContent).toContain('68 Glenwood Rd');
  });
});
