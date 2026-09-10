import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { CONTACT } from 'src/app/shared/contact';
import { SharedModule } from 'src/app/shared/shared.module';
import { breakParts, ContactUsComponent, DIRECTIONS_URL } from './contact-us.component';

describe('breakParts', () => {
  it('splits an email address only after the @', () => {
    expect(breakParts('info@justenable.co.za')).toEqual(['info@', 'justenable.co.za']);
  });

  it('leaves values without an @ whole', () => {
    expect(breakParts('+27 72 848 6786')).toEqual(['+27 72 848 6786']);
    expect(breakParts('Pretoria, 0081')).toEqual(['Pretoria, 0081']);
  });
});

describe('DIRECTIONS_URL', () => {
  it('asks Google Maps for directions to the street address', () => {
    expect(DIRECTIONS_URL).toBe(
      'https://www.google.com/maps/dir/?api=1&destination=68+Glenwood+Rd%2C+Lynnwood+Glen%2C+Pretoria%2C+0081'
    );
  });
});

describe('ContactUsComponent', () => {
  let component: ContactUsComponent;
  let fixture: ComponentFixture<ContactUsComponent>;
  let element: HTMLElement;

  const rows = (): HTMLAnchorElement[] =>
    Array.from(element.querySelectorAll('ul.plate > li > a'));
  const query = (selector: string): Element => {
    const found = element.querySelector(selector);
    if (!found) {
      throw new Error(`Missing ${selector}`);
    }
    return found;
  };
  const follows = (later: Element, earlier: Element): boolean =>
    (earlier.compareDocumentPosition(later) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContactUsComponent],
      imports: [SharedModule],
      providers: [provideRouter([]), provideTranslateService()],
    });
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', {
      'NAVIGATION.CONTACT_US': 'Contact us',
      'GLOBAL.CONTACT_US_TEXT': 'Get in touch.',
      'GLOBAL.EMAIL': 'Email',
      'GLOBAL.PHONE': 'Phone',
      'GLOBAL.MOBILE': 'Mobile',
      'GLOBAL.LOCATION': 'Location',
      'GLOBAL.NEW_WINDOW': '(opens in a new tab)',
      'GLOBAL.OPEN_IN_MAPS': 'Open in Google Maps',
      'CONTACT.MAP_TITLE': 'Map showing the office',
      'CONTACT.DIRECTIONS': 'Get directions',
    });
    translate.use('en');
    fixture = TestBed.createComponent(ContactUsComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('renders exactly one H1 with the translated page title', () => {
    const headings = element.querySelectorAll('h1');
    expect(headings.length).toBe(1);
    expect(headings[0].textContent?.trim()).toBe('Contact us');
  });

  it('links the email address via mailto', () => {
    const link = element.querySelector(`a[href="mailto:${CONTACT.email}"]`);
    expect(link).not.toBeNull();
  });

  it('dials the phone numbers in E.164 form', () => {
    expect(element.querySelector('a[href="tel:+27728486786"]')).not.toBeNull();
    expect(element.querySelector('a[href="tel:+27872652874"]')).not.toBeNull();
  });

  it('renders the contact details', () => {
    const text = element.textContent ?? '';
    expect(text).toContain(CONTACT.email);
    expect(text).toContain(CONTACT.phone);
    expect(text).toContain(CONTACT.mobile);
    for (const line of component.addressLines) {
      expect(text).toContain(line);
    }
  });

  it('renders four numbered rows that are whole-row links at least 44px tall', () => {
    const links = rows();
    expect(links.length).toBe(4);
    expect(links.map((link) => link.querySelector('.tag')?.textContent?.trim())).toEqual([
      '01',
      '02',
      '03',
      '04',
    ]);
    for (const link of links) {
      expect(link.classList.contains('channel-row')).toBeTrue();
      expect(parseFloat(getComputedStyle(link).minHeight)).toBeGreaterThanOrEqual(44);
    }
  });

  it('labels each row with a translated eyebrow', () => {
    const labels = rows().map((link) =>
      link.querySelector('.eyebrow')?.textContent?.trim()
    );
    expect(labels).toEqual(['Email', 'Phone', 'Mobile', 'Location']);
  });

  it('marks identifiers as untranslatable and the address as English', () => {
    const [email, phone, mobile, location] = rows();
    for (const link of [email, phone, mobile]) {
      const value = link.querySelector('.channel-row__value');
      expect(value?.getAttribute('translate')).toBe('no');
      // The spec step at every width; the <wbr> after "@" handles 320px.
      expect(value?.classList.contains('text-mono-value-l')).toBeTrue();
    }
    const address = location.querySelector('.channel-row__value');
    expect(address?.getAttribute('lang')).toBe('en');
    expect(address?.textContent?.trim()).toBe(component.addressLines.join(', '));
    expect(element.querySelector('address')?.getAttribute('lang')).toBe('en');
  });

  it('offers break opportunities inside the email address without adding spaces', () => {
    const [email, phone, mobile] = rows();
    const value = email.querySelector('.channel-row__value');
    expect(value?.querySelectorAll('wbr').length).toBe(1);
    expect(value?.textContent).toBe(CONTACT.email);
    for (const link of [phone, mobile]) {
      expect(link.querySelector('.channel-row__value wbr')).toBeNull();
    }
  });

  it('hides the arrow glyphs from assistive technology', () => {
    for (const link of rows()) {
      const arrow = link.querySelector('.channel-row__arrow');
      expect(arrow?.getAttribute('aria-hidden')).toBe('true');
    }
  });

  it('opens every external link in a new tab with noopener and an sr-only note', () => {
    const external = Array.from(
      element.querySelectorAll<HTMLAnchorElement>('a[target="_blank"]')
    );
    expect(external.map((link) => link.getAttribute('href'))).toEqual([
      component.mapsUrl,
      component.mapsUrl,
      component.directionsUrl,
    ]);
    for (const link of external) {
      expect(link.getAttribute('rel')).toBe('noopener');
      expect(link.querySelector('.sr-only')?.textContent?.trim()).toBe(
        '(opens in a new tab)'
      );
    }
  });

  it('offers "Open in Google Maps" and "Get directions" as ghost links under the map', () => {
    const [maps, directions] = Array.from(
      element.querySelectorAll<HTMLAnchorElement>('a.btn--ghost')
    );
    expect(maps.getAttribute('href')).toBe(component.mapsUrl);
    expect(maps.textContent).toContain('Open in Google Maps');
    expect(directions.getAttribute('href')).toBe(DIRECTIONS_URL);
    expect(directions.getAttribute('target')).toBe('_blank');
    expect(directions.getAttribute('rel')).toBe('noopener');
    expect(directions.textContent).toContain('Get directions');
    expect(directions.querySelector('[aria-hidden="true"]')?.textContent?.trim()).toBe('→');
    expect(directions.querySelector('.sr-only')?.textContent?.trim()).toBe(
      '(opens in a new tab)'
    );
    // Both follow the map: the address block sits between the screen and the links.
    const screen = query('.screen');
    expect(follows(maps, screen)).toBeTrue();
    expect(follows(directions, screen)).toBeTrue();
  });

  it('gives the map iframe a translated title inside a screen that fills the band', () => {
    const iframe = element.querySelector('.screen > iframe');
    expect(iframe?.getAttribute('title')).toBe('Map showing the office');
    expect(iframe?.getAttribute('loading')).toBe('lazy');
    expect(iframe?.getAttribute('referrerpolicy')).toBe('no-referrer-when-downgrade');
    expect(iframe?.getAttribute('src')).toContain('https://www.google.com/maps/embed');
    expect(element.querySelectorAll('iframe').length).toBe(1);
  });

  it('keeps the channel list before the map in reading order and floats it over the map from lg', () => {
    const plate = query('ul.plate');
    const screen = query('.screen');
    expect(follows(screen, plate)).toBeTrue();
    expect(plate.parentElement).toBe(screen.parentElement);
    // right-8: Google's place card sits top-left; 24rem at lg keeps the plate
    // off the centred office pin at 1024.
    for (const cls of [
      'lg:absolute',
      'lg:right-8',
      'lg:w-[24rem]',
      'xl:w-[27rem]',
      'lg:shadow-popover',
    ]) {
      expect(plate.classList.contains(cls)).withContext(cls).toBeTrue();
    }
  });

  it('renders no lamps on the contact page', () => {
    expect(element.querySelector('app-lamp')).toBeNull();
  });
});
