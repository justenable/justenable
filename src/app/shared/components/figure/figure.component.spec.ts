import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { FakeIntersectionObserver } from 'src/testing/intersection-observer';
import { stubReducedMotion } from 'src/testing/motion';
import { SharedModule } from '../../shared.module';

@Component({
  template: `
    <app-figure captionKey="TEST.CAPTION">
      <svg aria-hidden="true" viewBox="0 0 10 10"><circle r="1" /></svg>
    </app-figure>
  `,
  standalone: false,
})
class HostComponent {}

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
    translate.setTranslation('en', { 'TEST.CAPTION': 'Level control loop' }, true);
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
    expect(figure?.querySelector('figcaption')?.textContent?.trim()).toBe('Level control loop');
  });

  it('keeps the caption as the only text and the drawing hidden from assistive tech', () => {
    expect(element.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
    expect(element.querySelector('figcaption')?.classList.contains('tag')).toBeTrue();
  });
});
