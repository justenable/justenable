import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { NotFoundComponent } from './not-found.component';

describe('NotFoundComponent', () => {
  let fixture: ComponentFixture<NotFoundComponent>;
  let element: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NotFoundComponent],
      providers: [provideRouter([]), provideTranslateService()],
    });
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', {
      'NOT_FOUND.TITLE': 'Page not found',
      'NOT_FOUND.MESSAGE': 'The page does not exist.',
      'NOT_FOUND.BACK_HOME': 'Back to home',
    });
    translate.use('en');
    fixture = TestBed.createComponent(NotFoundComponent);
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('renders exactly one H1 with the translated title', () => {
    const headings = element.querySelectorAll('h1');
    expect(headings.length).toBe(1);
    expect(headings[0].textContent?.trim()).toBe('Page not found');
  });

  it('shows the unlit lamp beside the 404 readout', () => {
    const lamp = element.querySelector('app-lamp svg');
    expect(lamp?.getAttribute('aria-hidden')).toBe('true');
    expect(lamp?.classList.contains('lamp--lit')).toBeFalse();
    expect(lamp?.getAttribute('width')).toBe('14');
    expect(element.querySelector('app-lamp + .tag')?.textContent?.trim()).toBe('404');
  });

  it('renders the message and the primary link home', () => {
    expect(element.querySelector('p.text-body')?.textContent?.trim()).toBe(
      'The page does not exist.'
    );
    const link = element.querySelector('a.btn--primary');
    expect(link?.getAttribute('href')).toBe('/');
    expect(link?.textContent?.trim()).toBe('Back to home');
  });

  it('frames the plate with hazard strips hidden from assistive technology', () => {
    const plate = element.querySelector('.plate');
    expect(plate).not.toBeNull();
    const strips = Array.from(plate?.querySelectorAll('.hazard') ?? []);
    expect(strips.length).toBe(2);
    for (const strip of strips) {
      expect(strip.getAttribute('aria-hidden')).toBe('true');
    }
    expect(plate?.firstElementChild?.classList.contains('hazard')).toBeTrue();
    expect(plate?.lastElementChild?.classList.contains('hazard')).toBeTrue();
  });
});
