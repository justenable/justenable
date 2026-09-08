import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  provideTranslateService,
  TranslatePipe,
  TranslateService,
} from '@ngx-translate/core';
import { FeatureSectionComponent } from './feature-section.component';

@Component({
  template: `
    <app-feature-section
      tag="A-01"
      [id]="'a-01'"
      titleKey="GLOBAL.PROCESS_AUTOMATION"
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
}

@Component({
  template: `<app-feature-section id="m-01" tag="M-01" titleKey="GLOBAL.PROCESS_AUTOMATION" />`,
  standalone: false,
})
class StaticIdHostComponent {}

describe('FeatureSectionComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let element: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeatureSectionComponent, HostComponent, StaticIdHostComponent],
      imports: [CommonModule, TranslatePipe],
      providers: [provideTranslateService()],
    });
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', {
      'GLOBAL.PROCESS_AUTOMATION': 'Process automation',
    });
    translate.use('en');
    fixture = TestBed.createComponent(HostComponent);
    element = fixture.nativeElement;
    fixture.detectChanges();
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
    expect(root.querySelector('app-feature-section')?.hasAttribute('id')).toBeFalse();
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

  it('keeps the figure first at lg when reversed', () => {
    fixture.componentInstance.reverse = true;
    fixture.detectChanges();
    const figureColumn = element.querySelector('.screen')?.parentElement;
    expect(figureColumn?.classList).toContain('order-first');
    expect(figureColumn?.classList).not.toContain('lg:order-none');
  });
});
