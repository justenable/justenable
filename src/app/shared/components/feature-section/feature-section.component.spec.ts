import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  provideTranslateService,
  TranslatePipe,
  TranslateService,
} from '@ngx-translate/core';
import { RevealDirective } from 'src/app/directives/reveal.directive';
import { FakeIntersectionObserver } from 'src/testing/intersection-observer';
import { stubReducedMotion } from 'src/testing/motion';
import { FeatureSectionComponent } from './feature-section.component';

@Component({
  template: `
    <app-feature-section
      tag="A-01"
      [id]="'a-01'"
      titleKey="GLOBAL.PROCESS_AUTOMATION"
      [introKey]="introKey"
      [reverse]="reverse"
    >
      <ul body class="dash-list">
        <li>Bullet</li>
      </ul>
      <div figure class="screen">Figure</div>
    </app-feature-section>
  `,
  standalone: false,
})
class HostComponent {
  reverse = false;
  introKey?: string;
}

@Component({
  template: `<app-feature-section
    id="m-01"
    tag="M-01"
    titleKey="GLOBAL.PROCESS_AUTOMATION"
  />`,
  standalone: false,
})
class StaticIdHostComponent {}

describe('FeatureSectionComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let element: HTMLElement;

  beforeEach(() => {
    stubReducedMotion(false);
    FakeIntersectionObserver.install();
    TestBed.configureTestingModule({
      declarations: [
        FeatureSectionComponent,
        RevealDirective,
        HostComponent,
        StaticIdHostComponent,
      ],
      imports: [CommonModule, TranslatePipe],
      providers: [provideTranslateService()],
    });
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', {
      'GLOBAL.PROCESS_AUTOMATION': 'Process automation',
      'GLOBAL.PROCESS_AUTOMATION_INTRO':
        'We take the repetitive steps off your people.',
    });
    translate.use('en');
    fixture = TestBed.createComponent(HostComponent);
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  afterEach(() => FakeIntersectionObserver.restore());

  it('reveals the whole section on scroll', () => {
    const section = element.querySelector('section')!;
    expect(section.classList.contains('reveal')).toBeTrue();
    expect(FakeIntersectionObserver.instances[0].observed).toEqual([section]);
  });

  it('renders a focusable H2 carrying the section id', () => {
    const heading = element.querySelector('h2');
    expect(heading?.id).toBe('a-01');
    expect(heading?.getAttribute('tabindex')).toBe('-1');
    expect(heading?.textContent?.trim()).toBe('Process automation');
    expect(element.querySelectorAll('#a-01').length).toBe(1);
  });

  it('keeps the id unique when a page writes it as a static attribute', () => {
    const staticFixture = TestBed.createComponent(StaticIdHostComponent);
    staticFixture.detectChanges();
    const root: HTMLElement = staticFixture.nativeElement;

    expect(root.querySelectorAll('#m-01').length).toBe(1);
    expect(root.querySelector('h2')?.id).toBe('m-01');
    expect(
      root.querySelector('app-feature-section')?.hasAttribute('id'),
    ).toBeFalse();
  });

  it('omits the framing sentence when no intro key is given', () => {
    const textColumn = element.querySelector('h2')?.parentElement;
    expect(textColumn?.querySelector('p')).toBeNull();
    expect(element.querySelector('h2')?.classList).toContain('mb-4');
  });

  it('sets the framing sentence between the heading and the body, in the lead step', () => {
    fixture.componentInstance.introKey = 'GLOBAL.PROCESS_AUTOMATION_INTRO';
    fixture.detectChanges();

    const heading = element.querySelector('h2')!;
    const intro = heading.nextElementSibling as HTMLElement;
    expect(intro.tagName).toBe('P');
    expect(intro.textContent?.trim()).toBe(
      'We take the repetitive steps off your people.',
    );
    expect(intro.classList).toContain('text-lead');
    expect(intro.classList).toContain('text-ink-muted');
    expect(intro.nextElementSibling?.tagName).toBe('UL');
    expect(heading.classList).toContain('mb-3');
  });

  it('shows the tag in a section marker hidden from assistive technology', () => {
    const marker = element.querySelector('.section-marker');
    expect(marker?.getAttribute('aria-hidden')).toBe('true');
    expect(marker?.querySelector('.tag')?.textContent).toBe('A-01');
  });

  it('projects the body next to the heading and the figure into its own column', () => {
    const textColumn = element.querySelector('h2')?.parentElement;
    expect(textColumn?.querySelector('ul.dash-list')).not.toBeNull();
    const figureColumn = element.querySelector('.screen')?.parentElement;
    expect(figureColumn?.classList).toContain('order-first');
    expect(figureColumn?.classList).toContain('lg:order-none');
  });

  it('splits 7/5 from lg and 6/6 from xl', () => {
    const textColumn = element.querySelector('h2')?.parentElement;
    const figureColumn = element.querySelector('.screen')?.parentElement;
    expect(textColumn?.classList).toContain('lg:col-span-7');
    expect(textColumn?.classList).toContain('xl:col-span-6');
    expect(figureColumn?.classList).toContain('lg:col-span-5');
    expect(figureColumn?.classList).toContain('xl:col-span-6');
  });

  it('keeps the figure first at lg when reversed', () => {
    fixture.componentInstance.reverse = true;
    fixture.detectChanges();
    const figureColumn = element.querySelector('.screen')?.parentElement;
    expect(figureColumn?.classList).toContain('order-first');
    expect(figureColumn?.classList).not.toContain('lg:order-none');
  });
});
