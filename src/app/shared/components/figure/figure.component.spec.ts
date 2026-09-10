import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { FakeIntersectionObserver } from 'src/testing/intersection-observer';
import { stubReducedMotion } from 'src/testing/motion';
import { SharedModule } from '../../shared.module';

@Component({
  template: `
    <app-figure captionKey="TEST.CAPTION" [outcomeKey]="outcomeKey">
      <svg aria-hidden="true" viewBox="0 0 10 10"><circle r="1" /></svg>
    </app-figure>
  `,
  standalone: false,
})
class HostComponent {
  outcomeKey?: string;
}

describe('FigureComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let element: HTMLElement;

  beforeEach(() => {
    stubReducedMotion(false);
    FakeIntersectionObserver.install();
    TestBed.configureTestingModule({
      declarations: [HostComponent],
      imports: [SharedModule],
      providers: [provideTranslateService()],
    });
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation(
      'en',
      {
        'TEST.CAPTION': 'Level control loop',
        'TEST.OUTCOME': 'The plant holds its own level',
      },
      true,
    );
    translate.use('en');
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    element = fixture.nativeElement;
  });

  afterEach(() => FakeIntersectionObserver.restore());

  it('reveals the figure on scroll, which starts the draw-in', () => {
    const figure = element.querySelector('figure')!;
    expect(figure.classList.contains('reveal')).toBeTrue();
    expect(FakeIntersectionObserver.instances[0].observed).toEqual([figure]);
  });

  it('projects the drawing inside a figure with the translated caption', () => {
    const figure = element.querySelector('figure');
    expect(figure?.querySelector('svg')).not.toBeNull();
    expect(figure?.querySelector('figcaption')?.textContent?.trim()).toBe(
      'Level control loop',
    );
  });

  it('keeps the caption as the only text and the drawing hidden from assistive tech', () => {
    expect(element.querySelector('svg')?.getAttribute('aria-hidden')).toBe(
      'true',
    );
    expect(
      element.querySelector('figcaption')?.classList.contains('tag'),
    ).toBeTrue();
  });

  it('leads with the outcome and demotes the caption to a mono subtitle', () => {
    fixture.componentInstance.outcomeKey = 'TEST.OUTCOME';
    fixture.detectChanges();

    const lines = element.querySelectorAll('figcaption span');
    expect(lines.length).toBe(2);
    expect(lines[0].textContent?.trim()).toBe('The plant holds its own level');
    expect(lines[0].classList).toContain('text-body-s');
    expect(lines[0].classList).toContain('text-ink');
    expect(lines[1].textContent?.trim()).toBe('Level control loop');
    expect(lines[1].classList).toContain('tag');
    expect(lines[1].classList).toContain('text-ink-muted');
  });

  it('keeps both lines inside the one figcaption', () => {
    fixture.componentInstance.outcomeKey = 'TEST.OUTCOME';
    fixture.detectChanges();

    expect(element.querySelectorAll('figcaption').length).toBe(1);
  });
});
