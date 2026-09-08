import { Location } from '@angular/common';
import { provideLocationMocks, SpyLocation } from '@angular/common/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { SkipLinkComponent } from './skip-link.component';

describe('SkipLinkComponent', () => {
  let fixture: ComponentFixture<SkipLinkComponent>;
  let link: HTMLAnchorElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SkipLinkComponent],
      imports: [TranslatePipe],
      providers: [provideTranslateService(), provideLocationMocks()],
    });
    (TestBed.inject(Location) as SpyLocation).setInitialPath('/automation');
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', { 'A11Y.SKIP_TO_CONTENT': 'Skip to content' });
    translate.use('en');
    fixture = TestBed.createComponent(SkipLinkComponent);
    fixture.detectChanges();
    link = fixture.nativeElement.querySelector('a');
  });

  it('points at the main landmark of the current page with a translated label', () => {
    // A bare "#main" would resolve against <base href="/"> and leave the page.
    expect(link.getAttribute('href')).toBe('/automation#main');
    expect(link.textContent?.trim()).toBe('Skip to content');
  });

  it('moves focus to main#main without leaving the page', () => {
    const main = document.createElement('main');
    main.id = 'main';
    main.tabIndex = -1;
    document.body.appendChild(main);

    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    link.dispatchEvent(event);

    expect(event.defaultPrevented).toBeTrue();
    expect(document.activeElement).toBe(main);
    main.remove();
  });

  it('is visually hidden until it receives focus', () => {
    expect(link.classList.contains('skip-link')).toBeTrue();
    expect(getComputedStyle(link).position).toBe('absolute');

    link.focus();
    expect(link.matches(':focus-visible')).toBeTrue();
    expect(getComputedStyle(link).position).toBe('fixed');
  });
});
