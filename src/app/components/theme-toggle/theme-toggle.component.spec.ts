import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { THEME_STORAGE_KEY, ThemeService } from 'src/app/services/theme.service';
import { LampComponent } from 'src/app/shared/ui/lamp/lamp.component';
import { ThemeToggleComponent } from './theme-toggle.component';

@Component({
  template: `<app-theme-toggle [labelled]="labelled" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class HostComponent {
  labelled = false;
}

describe('ThemeToggleComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let theme: ThemeService;

  const button = (): HTMLButtonElement => fixture.nativeElement.querySelector('button');

  beforeEach(() => {
    // Deterministic start regardless of the test machine's colour scheme.
    localStorage.setItem(THEME_STORAGE_KEY, 'false');
    TestBed.configureTestingModule({
      declarations: [HostComponent, ThemeToggleComponent, LampComponent],
      imports: [TranslatePipe],
      providers: [provideTranslateService()],
    });
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', {
      'A11Y.TOGGLE_THEME': 'Toggle dark mode',
      'THEME.DARK_MODE': 'Dark mode',
    });
    translate.use('en');
    theme = TestBed.inject(ThemeService);
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.removeItem(THEME_STORAGE_KEY);
    document.documentElement.classList.remove('dark');
  });

  const marks = (): boolean[] =>
    Array.from(button().querySelectorAll('.rocker__mark')).map((mark) =>
      mark.classList.contains('is-active')
    );

  it('reflects the theme on aria-pressed, the O/I marks and the knob lamp', () => {
    expect(button().getAttribute('aria-pressed')).toBe('false');
    expect(button().querySelector('.lamp--lit')).toBeNull();
    expect(marks()).toEqual([true, false]);

    button().click();
    fixture.detectChanges();

    expect(theme.isDark()).toBeTrue();
    expect(button().getAttribute('aria-pressed')).toBe('true');
    expect(button().querySelector('.lamp--lit')).not.toBeNull();
    expect(marks()).toEqual([false, true]);
  });

  it('names itself with visually hidden text in the bar variant', () => {
    expect(button().getAttribute('aria-labelledby')).toBeNull();
    expect(button().querySelector('.sr-only')?.textContent?.trim()).toBe('Toggle dark mode');
  });

  it('is labelled by the visible "Dark mode" label in the panel variant', () => {
    fixture.componentInstance.labelled = true;
    fixture.detectChanges();

    const labelId = button().getAttribute('aria-labelledby')!;
    const label = fixture.nativeElement.querySelector(`#${labelId}`);
    expect(label?.textContent?.trim()).toBe('Dark mode');
    expect(button().querySelector('.sr-only')).toBeNull();
  });
});
