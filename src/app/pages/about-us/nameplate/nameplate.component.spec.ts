import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  provideTranslateService,
  TranslatePipe,
  TranslateService,
} from '@ngx-translate/core';
import { INDUSTRY_KEYS, SERVICE_KEYS } from 'src/app/shared/catalogue';
import { CONTACT } from 'src/app/shared/contact';
import { UiModule } from 'src/app/shared/ui/ui.module';
import { NAME_SEPARATOR, NameplateComponent } from './nameplate.component';

const EN = {
  'NAMEPLATE.COMPANY': 'Company',
  'NAMEPLATE.MOTTO': 'Motto',
  'GLOBAL.LOCATION': 'Location',
  'FOOTER.CONTACT': 'Contact',
  'NAMEPLATE.SERVICES': 'Services',
  'NAMEPLATE.INDUSTRIES': 'Industries',
  'HOME.SUBTITLE': 'You think it, we build it.',
  'GLOBAL.DESIGN_ENGINEERING': 'Design engineering',
  'GLOBAL.SOFTWARE_ENGINEERING': 'Software engineering',
  'GLOBAL.PROJECT_MANAGEMENT': 'Project management',
  'GLOBAL.MAINTENANCE_AND_GENERAL_WORK': 'Maintenance and general work',
  'GLOBAL.FMCG': 'Fast-moving consumer goods (FMCG)',
  'GLOBAL.PET': 'Polyethylene terephthalate (PET) bottles',
  'GLOBAL.MINING': 'Mining',
  'GLOBAL.OIL_AND_GAS': 'Oil and gas',
};

const FR = {
  'NAMEPLATE.COMPANY': 'Entreprise',
  'NAMEPLATE.MOTTO': 'Devise',
  'GLOBAL.LOCATION': 'Emplacement',
  'FOOTER.CONTACT': 'Contact',
  'NAMEPLATE.SERVICES': 'Services',
  'NAMEPLATE.INDUSTRIES': 'Industries',
  'HOME.SUBTITLE': 'Vous le pensez, nous le construisons.',
  'GLOBAL.DESIGN_ENGINEERING': 'Ingénierie de conception',
  'GLOBAL.SOFTWARE_ENGINEERING': 'Génie logiciel',
  'GLOBAL.PROJECT_MANAGEMENT': 'Gestion de projet',
  'GLOBAL.MAINTENANCE_AND_GENERAL_WORK': 'Entretien et travaux généraux',
  'GLOBAL.FMCG': 'Biens de grande consommation (FMCG)',
  'GLOBAL.PET': 'Bouteilles en polyéthylène téréphtalate (PET)',
  'GLOBAL.MINING': 'Exploitation minière',
  'GLOBAL.OIL_AND_GAS': 'Pétrole et gaz',
};

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

  const text = (value: HTMLElement): string =>
    value.textContent?.replace(/\s+/g, ' ').trim() ?? '';

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NameplateComponent],
      imports: [CommonModule, UiModule, TranslatePipe],
      providers: [provideTranslateService()],
    });
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', EN);
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
    expect(logo?.querySelector('img')?.style.height).toBe('40px');
  });

  it('lists six labelled facts as ruled definition rows', () => {
    const facts = rows();
    expect(element.querySelectorAll('dd').length).toBe(6);
    expect(facts.map((fact) => fact.label)).toEqual([
      'Company',
      'Motto',
      'Location',
      'Contact',
      'Services',
      'Industries',
    ]);
    expect(text(facts[0].value)).toBe('Just Enable');
    expect(text(facts[1].value)).toBe('You think it, we build it.');
    expect(text(facts[2].value)).toBe(CONTACT.locality);
    expect(facts[2].value.getAttribute('lang')).toBe('en');

    // Each row is one element of the list, so a rule can run under the whole
    // field; the list itself rules off the last one.
    const rowElements = Array.from(element.querySelectorAll('dl > .nameplate__row'));
    expect(rowElements.length).toBe(6);
    for (const row of rowElements) {
      expect(row.querySelectorAll('dt').length).toBe(1);
      expect(row.querySelectorAll('dd').length).toBe(1);
      expect(getComputedStyle(row).borderTopWidth).toBe('1px');
    }
    expect(getComputedStyle(element.querySelector('dl')!).borderBottomWidth).toBe('1px');
  });

  it('links the contact row to the shared email address', () => {
    const contact = rows()[3].value;
    expect(contact.getAttribute('translate')).toBe('no');
    const link = contact.querySelector('a');
    expect(link?.getAttribute('href')).toBe(`mailto:${CONTACT.email}`);
    expect(link?.textContent?.trim()).toBe(CONTACT.email);
  });

  it('derives the services and industries rows from the shared catalogue, in order', () => {
    expect(SERVICE_KEYS.length).toBe(4);
    expect(INDUSTRY_KEYS.length).toBe(4);
    expect(text(rows()[4].value)).toBe(SERVICE_KEYS.map((key) => EN[key]).join(' · '));
    expect(text(rows()[4].value)).toBe(
      'Design engineering · Software engineering · Project management · Maintenance and general work'
    );
    expect(text(rows()[5].value)).toBe(INDUSTRY_KEYS.map((key) => EN[key]).join(' · '));
    expect(text(rows()[5].value)).toBe(
      'Fast-moving consumer goods (FMCG) · Polyethylene terephthalate (PET) bottles · Mining · Oil and gas'
    );
  });

  it('keeps the dot with the name before it when a row wraps', () => {
    expect(NAME_SEPARATOR).toBe('\u00a0· ');
    const raw = rows()[4].value.textContent ?? '';
    expect(raw).toContain('Design engineering\u00a0· Software engineering');
  });

  it('translates the labels and the listed names when the language changes', () => {
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('fr', FR);
    translate.use('fr');
    fixture.detectChanges();

    expect(rows().map((fact) => fact.label)).toEqual([
      'Entreprise',
      'Devise',
      'Emplacement',
      'Contact',
      'Services',
      'Industries',
    ]);
    expect(text(rows()[1].value)).toBe('Vous le pensez, nous le construisons.');
    expect(text(rows()[4].value)).toBe(
      'Ingénierie de conception · Génie logiciel · Gestion de projet · Entretien et travaux généraux'
    );
    expect(text(rows()[5].value)).toContain('Pétrole et gaz');
  });
});
