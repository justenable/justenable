import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ClickElsewhereDirective } from 'src/app/directives/click-elsewhere.directive';
import { LampComponent } from 'src/app/shared/ui/lamp/lamp.component';
import { LanguageSwitcherComponent } from './language-switcher.component';

@Component({
  template: `<app-language-switcher [segmented]="segmented" /><button id="after" type="button">after</button>`,
  standalone: false,
})
class HostComponent {
  segmented = false;
}

describe('LanguageSwitcherComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let translate: TranslateService;

  const root = (): HTMLElement => fixture.nativeElement;
  const trigger = (): HTMLButtonElement => root().querySelector('.lang__trigger')!;
  const items = (): HTMLButtonElement[] =>
    Array.from(root().querySelectorAll('[role="menuitemradio"]'));
  const radios = (): HTMLButtonElement[] =>
    Array.from(root().querySelectorAll('[role="radio"]'));

  function key(target: Element, key: string): void {
    target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
    fixture.detectChanges();
  }

  async function openMenu(): Promise<void> {
    trigger().click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        HostComponent,
        LanguageSwitcherComponent,
        LampComponent,
        ClickElsewhereDirective,
      ],
      imports: [TranslatePipe],
      providers: [provideTranslateService()],
    });
    translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', { 'A11Y.SELECT_LANGUAGE': 'Select language' });
    translate.setTranslation('fr', { 'A11Y.SELECT_LANGUAGE': 'Choisir la langue' });
    translate.use('en');
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  describe('bar variant', () => {
    it('describes the trigger with the current language and controls the menu', () => {
      expect(trigger().getAttribute('aria-haspopup')).toBe('true');
      expect(trigger().getAttribute('aria-expanded')).toBe('false');
      // The menu does not exist while closed, so the IDREF must not dangle.
      expect(trigger().getAttribute('aria-controls')).toBeNull();
      expect(trigger().getAttribute('aria-label')).toBe('Select language: English');
      expect(trigger().textContent?.trim()).toBe('en');
      expect(root().querySelector('#lang-menu')).toBeNull();
    });

    it('opens a menu of endonyms with lang attributes and the current one checked', async () => {
      await openMenu();
      expect(trigger().getAttribute('aria-expanded')).toBe('true');
      expect(trigger().getAttribute('aria-controls')).toBe('lang-menu');
      const menu = root().querySelector('#lang-menu')!;
      expect(menu.getAttribute('role')).toBe('menu');
      expect(items().map((item) => item.lang)).toEqual(['af', 'en', 'fr', 'sw', 'zu']);
      expect(items().map((item) => item.textContent?.trim())).toEqual([
        'Afrikaans',
        'English',
        'Français',
        'Kiswahili',
        'isiZulu',
      ]);
      expect(items().map((item) => item.getAttribute('aria-checked'))).toEqual([
        'false',
        'true',
        'false',
        'false',
        'false',
      ]);
      expect(items()[1].querySelector('.lamp--lit')).not.toBeNull();
      expect(document.activeElement).toBe(items()[1]);
    });

    it('moves focus with arrows (wrapping), Home and End', async () => {
      await openMenu();
      key(items()[1], 'ArrowDown');
      expect(document.activeElement).toBe(items()[2]);
      key(items()[4], 'ArrowDown');
      expect(document.activeElement).toBe(items()[0]);
      key(items()[0], 'ArrowUp');
      expect(document.activeElement).toBe(items()[4]);
      key(items()[4], 'Home');
      expect(document.activeElement).toBe(items()[0]);
      key(items()[0], 'End');
      expect(document.activeElement).toBe(items()[4]);
    });

    it('closes on Escape and returns focus to the trigger', async () => {
      await openMenu();
      key(items()[1], 'Escape');
      expect(root().querySelector('#lang-menu')).toBeNull();
      expect(trigger().getAttribute('aria-expanded')).toBe('false');
      expect(document.activeElement).toBe(trigger());
    });

    it('selects a language, closes and updates the trigger', async () => {
      await openMenu();
      items()[2].click();
      fixture.detectChanges();
      expect(translate.getCurrentLang()).toBe('fr');
      expect(root().querySelector('#lang-menu')).toBeNull();
      expect(document.activeElement).toBe(trigger());
      expect(trigger().textContent?.trim()).toBe('fr');
      expect(trigger().getAttribute('aria-label')).toBe('Choisir la langue: Français');
    });

    it('closes on Tab and on an outside click', async () => {
      await openMenu();
      key(items()[1], 'Tab');
      expect(root().querySelector('#lang-menu')).toBeNull();

      await openMenu();
      (root().querySelector('#after') as HTMLButtonElement).click();
      fixture.detectChanges();
      expect(root().querySelector('#lang-menu')).toBeNull();
    });

    it('opens from the trigger with ArrowDown focusing the first item', async () => {
      key(trigger(), 'ArrowDown');
      await fixture.whenStable();
      fixture.detectChanges();
      expect(document.activeElement).toBe(items()[0]);
    });

    it('opens from the trigger with ArrowUp focusing the last item', async () => {
      key(trigger(), 'ArrowUp');
      await fixture.whenStable();
      fixture.detectChanges();
      expect(document.activeElement).toBe(items()[4]);
    });
  });

  describe('segmented variant', () => {
    beforeEach(() => {
      fixture.componentInstance.segmented = true;
      fixture.detectChanges();
    });

    it('renders a labelled radiogroup with the current language checked and lit', () => {
      const group = root().querySelector('[role="radiogroup"]')!;
      const label = root().querySelector(`#${group.getAttribute('aria-labelledby')}`);
      expect(label?.textContent?.trim()).toBe('Select language');
      expect(radios().map((radio) => radio.getAttribute('aria-checked'))).toEqual([
        'false',
        'true',
        'false',
        'false',
        'false',
      ]);
      expect(radios().map((radio) => radio.tabIndex)).toEqual([-1, 0, -1, -1, -1]);
      expect(radios()[1].querySelector('.lamp--lit')).not.toBeNull();
      expect(radios()[2].lang).toBe('fr');
    });

    it('arrow keys move focus and select, wrapping at both ends', () => {
      radios()[1].focus();
      key(radios()[1], 'ArrowRight');
      expect(translate.getCurrentLang()).toBe('fr');
      expect(document.activeElement).toBe(radios()[2]);
      expect(radios()[2].getAttribute('aria-checked')).toBe('true');

      key(radios()[2], 'End');
      expect(translate.getCurrentLang()).toBe('zu');
      key(radios()[4], 'ArrowRight');
      expect(translate.getCurrentLang()).toBe('af');
      key(radios()[0], 'ArrowLeft');
      expect(translate.getCurrentLang()).toBe('zu');
      key(radios()[4], 'Home');
      expect(translate.getCurrentLang()).toBe('af');
    });

    it('clicking a segment selects it', () => {
      radios()[3].click();
      fixture.detectChanges();
      expect(translate.getCurrentLang()).toBe('sw');
      expect(radios()[3].getAttribute('aria-checked')).toBe('true');
    });
  });
});
