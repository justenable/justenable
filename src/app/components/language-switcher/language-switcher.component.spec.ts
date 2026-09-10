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
      expect(root().querySelector('#lang-menu')).toBeNull();
    });

    it('names the current language on the closed trigger, in code and in words', () => {
      expect(trigger().querySelector('.lang__code')?.textContent?.trim()).toBe('en');
      // The endonym is CSS-hidden below xl, but it must be in the markup so
      // the trigger never rests on a two-letter code alone.
      expect(trigger().querySelector('.lang__endonym')?.textContent?.trim()).toBe('English');
      expect(trigger().querySelector('.lang__globe')).not.toBeNull();
    });

    it('opens a menu of endonyms with lang attributes and the current one checked', async () => {
      await openMenu();
      expect(trigger().getAttribute('aria-expanded')).toBe('true');
      expect(trigger().getAttribute('aria-controls')).toBe('lang-menu');
      const menu = root().querySelector('#lang-menu')!;
      expect(menu.getAttribute('role')).toBe('menu');
      expect(items().map((item) => item.lang)).toEqual(['af', 'en', 'fr', 'sw', 'zu']);
      expect(items().map((item) => item.querySelector('.lang__name')?.textContent?.trim())).toEqual([
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
      // The check replaces the lamp on the selected row: accent on the
      // inverted fill is 2.38:1 in dark and 6.46:1 in light, so the lamp's
      // silhouette is unreadable there. Unlit lamps stay on the other rows.
      expect(items()[1].querySelector('.lamp')).toBeNull();
      expect(items()[0].querySelector('.lamp')).not.toBeNull();
      expect(items().filter((item) => item.querySelector('.lamp--lit')).length).toBe(0);
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
      expect(trigger().querySelector('.lang__code')?.textContent?.trim()).toBe('fr');
      expect(trigger().querySelector('.lang__endonym')?.textContent?.trim()).toBe('Français');
      expect(trigger().getAttribute('aria-label')).toBe('Choisir la langue: Français');
    });

    // WCAG 1.4.1: the selected row must be identifiable without perceiving
    // colour, so each cue is asserted present on exactly one row and absent
    // on the other four. No lamp is lit anywhere: the check occupies that
    // column on the selected row instead.
    it('marks the selected row with cues that are not colour, and only that row', async () => {
      await openMenu();
      const selected = items().filter((item) => item.classList.contains('is-selected'));
      expect(selected.length).toBe(1);
      expect(selected[0].lang).toBe('en');
      expect(selected[0].getAttribute('aria-checked')).toBe('true');

      // Shape: a check mark glyph.
      expect(items().filter((item) => item.querySelector('svg.lang-check')).length).toBe(1);
      expect(selected[0].querySelector('svg.lang-check')).not.toBeNull();

      // Text: the language code repeated at the end of the row.
      expect(items().filter((item) => item.querySelector('.lang__current')).length).toBe(1);
      expect(selected[0].querySelector('.lang__current')?.textContent?.trim()).toBe('en');

      for (const item of items().filter((i) => i.lang !== 'en')) {
        expect(item.classList.contains('is-selected')).toBe(false);
        expect(item.querySelector('svg.lang-check')).toBeNull();
        expect(item.querySelector('.lang__current')).toBeNull();
        expect(item.querySelector('.lamp')).not.toBeNull();
      }
    });

    it('moves every selected-row cue when the language changes', async () => {
      await openMenu();
      items()[3].click();
      fixture.detectChanges();
      await openMenu();

      const selected = items().filter((item) => item.classList.contains('is-selected'));
      expect(selected.length).toBe(1);
      expect(selected[0].lang).toBe('sw');
      expect(selected[0].querySelector('svg.lang-check')).not.toBeNull();
      expect(selected[0].querySelector('.lang__current')?.textContent?.trim()).toBe('sw');
      expect(items()[1].querySelector('svg.lang-check')).toBeNull();
      expect(items()[1].classList.contains('is-selected')).toBe(false);
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
      expect(radios()[1].querySelector('.lamp')).toBeNull();
      expect(radios()[0].querySelector('.lamp')).not.toBeNull();
      expect(radios().filter((radio) => radio.querySelector('.lamp--lit')).length).toBe(0);
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

    // The chip's fill comes from .btn--secondary[aria-checked='true']; the
    // check adds a silhouette that survives a greyscale render, and replaces
    // the lit lamp, which is only 2.38:1 on that fill in dark mode.
    it('marks the checked segment with a check mark, and only that one', () => {
      expect(radios().filter((radio) => radio.querySelector('svg.lang-check')).length).toBe(1);
      expect(radios()[1].querySelector('svg.lang-check')).not.toBeNull();
      for (const radio of radios().filter((_, i) => i !== 1)) {
        expect(radio.querySelector('svg.lang-check')).toBeNull();
      }
    });

    it('moves the check mark when the selection changes', () => {
      radios()[4].click();
      fixture.detectChanges();
      expect(radios().filter((radio) => radio.querySelector('svg.lang-check')).length).toBe(1);
      expect(radios()[4].querySelector('svg.lang-check')).not.toBeNull();
      expect(radios()[1].querySelector('svg.lang-check')).toBeNull();
    });
  });
});
