import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ClickElsewhereDirective } from 'src/app/directives/click-elsewhere.directive';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let translate: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderComponent, ClickElsewhereDirective],
      imports: [RouterTestingModule, TranslateModule.forRoot()],
    });
    translate = TestBed.inject(TranslateService);
    translate.use('en');
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows the current language in uppercase', () => {
    expect(component.selected).toBe('EN');
    translate.use('fr');
    expect(component.selected).toBe('FR');
  });

  it('toggleMenu flips state and the aria-expanded binding', () => {
    const menuButton: HTMLButtonElement =
      fixture.nativeElement.querySelector('.menu-button');
    expect(menuButton.getAttribute('aria-expanded')).toBe('false');

    component.toggleMenu();
    fixture.detectChanges();

    expect(component.showMenu).toBeTrue();
    expect(menuButton.getAttribute('aria-expanded')).toBe('true');
  });

  it('setLanguage activates the language and closes the list', () => {
    component.toggleLanguageList();
    expect(component.hideLanguageList).toBeFalse();

    component.setLanguage('ZU');

    expect(translate.currentLang).toBe('zu');
    expect(component.selected).toBe('ZU');
    expect(component.hideLanguageList).toBeTrue();
  });

  it('opening the language list closes the menu and vice versa', () => {
    component.toggleMenu();
    component.toggleLanguageList();
    expect(component.showMenu).toBeFalse();
    expect(component.hideLanguageList).toBeFalse();

    component.toggleMenu();
    expect(component.showMenu).toBeTrue();
    expect(component.hideLanguageList).toBeTrue();
  });
});
