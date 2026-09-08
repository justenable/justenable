import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, RouterModule } from '@angular/router';
import {
  provideTranslateService,
  TranslatePipe,
  TranslateService,
} from '@ngx-translate/core';
import { CtaBandComponent } from './cta-band.component';

describe('CtaBandComponent', () => {
  let fixture: ComponentFixture<CtaBandComponent>;
  let element: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CtaBandComponent],
      imports: [TranslatePipe, RouterModule],
      providers: [provideRouter([]), provideTranslateService()],
    });
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', {
      'GLOBAL.AUTOMATION_OUTRO_SUMMARY': 'Talk to {{ companyName }}.',
      'NAVIGATION.CONTACT_US': 'Contact us',
    });
    translate.use('en');
    fixture = TestBed.createComponent(CtaBandComponent);
    fixture.componentRef.setInput('textKey', 'GLOBAL.AUTOMATION_OUTRO_SUMMARY');
    fixture.componentRef.setInput('textParams', { companyName: 'Just Enable' });
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('renders the interpolated text on a plate', () => {
    expect(element.querySelector('.plate p')?.textContent?.trim()).toBe(
      'Talk to Just Enable.'
    );
  });

  it('links the primary button to the contact page', () => {
    const button = element.querySelector('a.btn--primary');
    expect(button?.getAttribute('href')).toBe('/contact-us');
    expect(button?.textContent?.trim()).toBe('Contact us');
  });
});
