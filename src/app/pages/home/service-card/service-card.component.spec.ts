import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  provideTranslateService,
  TranslatePipe,
  TranslateService,
} from '@ngx-translate/core';
import { ServiceCardMedia } from 'src/app/models/service-card.model';
import { LadderFigureComponent } from '../ladder-figure/ladder-figure.component';
import { ServiceCardComponent } from './service-card.component';

@Component({
  template: `
    <app-service-card
      tag="S1"
      titleKey="GLOBAL.DESIGN_ENGINEERING"
      descriptionKey="GLOBAL.DESIGN_ENGINEERING_DESCRIPTION"
      [media]="media"
    />
  `,
  standalone: false,
})
class HostComponent {
  media: ServiceCardMedia = {
    kind: 'photo',
    src: 'assets/img/design-engineering.webp',
    altKey: 'IMG.DESIGN_ENGINEERING_ALT',
    position: '50% 40%',
    width: 634,
    height: 953,
  };
}

describe('ServiceCardComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let element: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ServiceCardComponent, LadderFigureComponent, HostComponent],
      imports: [TranslatePipe],
      providers: [provideTranslateService()],
    });
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', {
      'GLOBAL.DESIGN_ENGINEERING': 'Design engineering',
      'GLOBAL.DESIGN_ENGINEERING_DESCRIPTION': 'Creating and developing products.',
      'IMG.DESIGN_ENGINEERING_ALT': 'Calipers and a bearing on a drawing',
    });
    translate.use('en');
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('renders the tag, an H3 and the description on a plate', () => {
    const plate = element.querySelector('.plate');
    expect(plate).not.toBeNull();
    expect(plate?.querySelector('.tag')?.textContent).toBe('S1');
    expect(plate?.querySelector('h3')?.textContent?.trim()).toBe('Design engineering');
    expect(plate?.querySelector('h3 + p')?.textContent?.trim()).toBe(
      'Creating and developing products.'
    );
    expect(element.querySelector('a')).toBeNull();
  });

  it('renders a photo with descriptive alt text, intrinsic size and its crop', () => {
    const img = element.querySelector('img');
    expect(img?.getAttribute('src')).toBe('assets/img/design-engineering.webp');
    expect(img?.getAttribute('alt')).toBe('Calipers and a bearing on a drawing');
    expect(img?.getAttribute('width')).toBe('634');
    expect(img?.getAttribute('height')).toBe('953');
    expect(img?.getAttribute('loading')).toBe('lazy');
    expect(img?.style.objectPosition).toBe('50% 40%');
    expect(element.querySelector('app-ladder-figure')).toBeNull();
  });

  it('renders the ladder figure instead of a photo', () => {
    host.media = { kind: 'ladder' };
    fixture.detectChanges();

    expect(element.querySelector('img')).toBeNull();
    const figure = element.querySelector('app-ladder-figure svg');
    expect(figure?.getAttribute('aria-hidden')).toBe('true');
  });
});
