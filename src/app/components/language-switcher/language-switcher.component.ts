import {
  afterNextRender,
  booleanAttribute,
  Component,
  computed,
  ElementRef,
  inject,
  Injector,
  Input,
  signal,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { currentLanguage, LANGUAGES, LanguageCode } from 'src/app/shared/languages';

let nextId = 0;

/**
 * Bar variant: a trigger showing the language code and a menu of endonyms
 * (menu / menuitemradio). Panel variant ([segmented]): a radiogroup of
 * secondary buttons. Both light a lamp next to the selected language; the
 * lamp is never the only state cue (aria-checked carries it).
 */
@Component({
  selector: 'app-language-switcher',
  standalone: false,
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.scss'],
})
export class LanguageSwitcherComponent {
  @Input({ transform: booleanAttribute }) segmented = false;

  readonly languages = LANGUAGES;
  readonly labelId = `language-group-label-${nextId++}`;
  readonly open = signal(false);

  private readonly translate = inject(TranslateService);
  private readonly injector = inject(Injector);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly current = currentLanguage(this.translate);

  readonly currentName = computed(
    () => LANGUAGES.find((language) => language.code === this.current())?.name ?? ''
  );

  toggleMenu(): void {
    if (this.open()) {
      this.closeMenu(true);
    } else {
      this.openMenu('current');
    }
  }

  onTriggerKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.openMenu('first');
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.openMenu('last');
    }
  }

  onMenuKeydown(event: KeyboardEvent): void {
    const items = this.menuItems();
    const index = items.indexOf(event.target as HTMLButtonElement);
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        items[(index + 1) % items.length]?.focus();
        break;
      case 'ArrowUp':
        event.preventDefault();
        items[(index - 1 + items.length) % items.length]?.focus();
        break;
      case 'Home':
        event.preventDefault();
        items[0]?.focus();
        break;
      case 'End':
        event.preventDefault();
        items[items.length - 1]?.focus();
        break;
      case 'Escape':
        event.preventDefault();
        // The header panel also listens for Escape; this one is ours.
        event.stopPropagation();
        this.closeMenu(true);
        break;
      case 'Tab':
        this.closeMenu(false);
        break;
    }
  }

  select(code: LanguageCode): void {
    this.translate.use(code);
    this.closeMenu(true);
  }

  onClickOutside(): void {
    if (this.open()) {
      this.closeMenu(false);
    }
  }

  // Radiogroup model: arrows move focus and select in one step.
  onGroupKeydown(event: KeyboardEvent): void {
    const radios = this.radios();
    const index = radios.indexOf(event.target as HTMLButtonElement);
    if (index === -1) {
      return;
    }
    let next: number;
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        next = (index + 1) % radios.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        next = (index - 1 + radios.length) % radios.length;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = radios.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    radios[next].focus();
    this.translate.use(this.languages[next].code);
  }

  selectSegment(code: LanguageCode): void {
    this.translate.use(code);
  }

  private openMenu(focus: 'current' | 'first' | 'last'): void {
    this.open.set(true);
    // The menu renders on the next change detection pass.
    afterNextRender(
      () => {
        const items = this.menuItems();
        const current = this.languages.findIndex((l) => l.code === this.current());
        const index =
          focus === 'first' ? 0 : focus === 'last' ? items.length - 1 : Math.max(current, 0);
        items[index]?.focus();
      },
      { injector: this.injector }
    );
  }

  private closeMenu(returnFocus: boolean): void {
    this.open.set(false);
    if (returnFocus) {
      this.trigger()?.focus();
    }
  }

  private trigger(): HTMLButtonElement | null {
    return this.host.nativeElement.querySelector<HTMLButtonElement>('.lang__trigger');
  }

  private menuItems(): HTMLButtonElement[] {
    return Array.from(
      this.host.nativeElement.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]')
    );
  }

  private radios(): HTMLButtonElement[] {
    return Array.from(
      this.host.nativeElement.querySelectorAll<HTMLButtonElement>('[role="radio"]')
    );
  }
}
