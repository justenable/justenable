import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslatePipe } from '@ngx-translate/core';
import { ThemeSwitcherComponent } from './theme-switcher.component';

describe('ThemeSwitcherComponent', () => {
  let component: ThemeSwitcherComponent;
  let fixture: ComponentFixture<ThemeSwitcherComponent>;

  beforeEach(() => {
    // Force a deterministic starting theme regardless of the test
    // machine's prefers-color-scheme.
    localStorage.setItem('isDarkMode', 'false');
    TestBed.configureTestingModule({
      declarations: [ThemeSwitcherComponent],
      imports: [TranslatePipe],
      providers: [provideTranslateService()],
    });
    fixture = TestBed.createComponent(ThemeSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.removeItem('isDarkMode');
    document.documentElement.classList.remove('dark');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('initializes from the stored theme', () => {
    expect(component.isDark).toBeFalse();
    expect(document.documentElement.classList.contains('dark')).toBeFalse();
  });

  it('toggleTheme toggles the dark class and persists the choice', () => {
    component.toggleTheme();

    expect(component.isDark).toBeTrue();
    expect(document.documentElement.classList.contains('dark')).toBeTrue();
    expect(localStorage.getItem('isDarkMode')).toBe('true');

    component.toggleTheme();

    expect(component.isDark).toBeFalse();
    expect(document.documentElement.classList.contains('dark')).toBeFalse();
    expect(localStorage.getItem('isDarkMode')).toBe('false');
  });

  it('reflects the state on the aria-pressed binding', () => {
    const button: HTMLButtonElement =
      fixture.nativeElement.querySelector('button');
    expect(button.getAttribute('aria-pressed')).toBe('false');

    component.toggleTheme();
    fixture.detectChanges();

    expect(button.getAttribute('aria-pressed')).toBe('true');
  });
});
