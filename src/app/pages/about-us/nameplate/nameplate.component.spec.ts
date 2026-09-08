import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  provideTranslateService,
  TranslatePipe,
  TranslateService,
} from '@ngx-translate/core';
import { CONTACT } from 'src/app/shared/contact';
import { UiModule } from 'src/app/shared/ui/ui.module';
import { NameplateComponent } from './nameplate.component';

describe('NameplateComponent', () => {
  let fixture: ComponentFixture<NameplateComponent>;
  let element: HTMLElement;

  const rows = (): { label: string; value: HTMLElement }[] => {
    const labels = Array.from(element.querySelectorAll('dt'));
    const values = Array.from(element.querySelectorAll('dd'));
    return labels.map((label, index) => ({
      label: label.textContent?.trim() ?? '',
      value: values[index],
    }));
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NameplateComponent],
      imports: [UiModule, TranslatePipe],
      providers: [provideTranslateService()],
    });
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', {
      'NAMEPLATE.COMPANY': 'Company',
      'NAMEPLATE.MOTTO': 'Motto',
      'GLOBAL.LOCATION': 'Location',
      'FOOTER.CONTACT': 'Contact',
      'HOME.SUBTITLE': 'You think it, we build it.',
    });
    translate.use('en');
    fixture = TestBed.createComponent(NameplateComponent);
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('is an inset plate carrying the mark as decoration', () => {
    const plate = element.querySelector('.plate');
    expect(plate?.classList).toContain('plate--inset');
    const logo = plate?.querySelector('app-logo');
    expect(logo?.getAttribute('aria-hidden')).toBe('true');
    expect(logo?.querySelector('img')?.style.height).toBe('24px');
  });

  it('lists four labelled facts as definition rows', () => {
    const facts = rows();
    expect(element.querySelectorAll('dd').length).toBe(4);
    expect(facts.map((fact) => fact.label)).toEqual([
      'Company',
      'Motto',
      'Location',
      'Contact',
    ]);
    expect(facts[0].value.textContent?.trim()).toBe('Just Enable');
    expect(facts[1].value.textContent?.trim()).toBe(
      'You think it, we build it.'
    );
    expect(facts[2].value.textContent?.trim()).toBe(CONTACT.locality);
    expect(facts[2].value.getAttribute('lang')).toBe('en');
  });

  it('links the contact row to the shared email address', () => {
    const contact = rows()[3].value;
    expect(contact.getAttribute('translate')).toBe('no');
    const link = contact.querySelector('a');
    expect(link?.getAttribute('href')).toBe(`mailto:${CONTACT.email}`);
    expect(link?.textContent?.trim()).toBe(CONTACT.email);
  });

  it('translates the labels when the language changes', () => {
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('fr', {
      'NAMEPLATE.COMPANY': 'Entreprise',
      'NAMEPLATE.MOTTO': 'Devise',
      'GLOBAL.LOCATION': 'Emplacement',
      'FOOTER.CONTACT': 'Contact',
      'HOME.SUBTITLE': 'Vous le pensez, nous le construisons.',
    });
    translate.use('fr');
    fixture.detectChanges();

    expect(rows().map((fact) => fact.label)).toEqual([
      'Entreprise',
      'Devise',
      'Emplacement',
      'Contact',
    ]);
    expect(rows()[1].value.textContent?.trim()).toBe(
      'Vous le pensez, nous le construisons.'
    );
  });
});
