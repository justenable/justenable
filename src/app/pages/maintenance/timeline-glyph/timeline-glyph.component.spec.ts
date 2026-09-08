import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { GlyphVariant } from 'src/app/models/content-section.model';
import { SharedModule } from 'src/app/shared/shared.module';
import { TimelineGlyphComponent } from './timeline-glyph.component';

const CAPTIONS: Record<GlyphVariant, string> = {
  preventive: 'Serviced at fixed intervals',
  corrective: 'Repaired after a failure',
  predictive: 'Serviced before the predicted failure',
  asset: 'Tracked from commissioning to replacement',
  facility: 'Routine upkeep across building systems',
};

const VARIANTS = Object.keys(CAPTIONS) as GlyphVariant[];

/** Axis units and tags only: nothing in the SVG needs translating. */
const LABELS: Record<GlyphVariant, string[]> = {
  preventive: ['30 D', '60 D', '90 D', '120 D', '150 D'],
  corrective: ['MTTR'],
  predictive: ['T0', 'T1', 'T2'],
  asset: ['P-101', 'Y0', 'Y5', 'Y10'],
  facility: ['HVAC', 'LV', 'FP', 'W1', 'W2', 'W3', 'W4', 'W5'],
};

describe('TimelineGlyphComponent', () => {
  let fixture: ComponentFixture<TimelineGlyphComponent>;
  let element: HTMLElement;

  function render(variant: GlyphVariant): void {
    fixture.componentRef.setInput('variant', variant);
    fixture.detectChanges();
  }

  function svg(): SVGSVGElement | null {
    return element.querySelector('app-figure figure svg');
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimelineGlyphComponent],
      imports: [SharedModule],
      providers: [provideTranslateService()],
    });
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', {
      'MAINTENANCE.GLYPH_PREVENTIVE': CAPTIONS.preventive,
      'MAINTENANCE.GLYPH_CORRECTIVE': CAPTIONS.corrective,
      'MAINTENANCE.GLYPH_PREDICTIVE': CAPTIONS.predictive,
      'MAINTENANCE.GLYPH_ASSET': CAPTIONS.asset,
      'MAINTENANCE.GLYPH_FACILITY': CAPTIONS.facility,
    });
    translate.use('en');
    fixture = TestBed.createComponent(TimelineGlyphComponent);
    element = fixture.nativeElement;
  });

  it('draws on the canvas through the figure wrapper, hidden from assistive technology', () => {
    render('preventive');
    const drawing = svg();
    expect(drawing).not.toBeNull();
    expect(drawing?.getAttribute('aria-hidden')).toBe('true');
    expect(drawing?.getAttribute('viewBox')).toBe('0 0 480 200');
    expect(drawing?.getAttribute('stroke')).toBe('currentColor');
    expect(drawing?.classList).toContain('w-full');
    expect(element.querySelector('.plate, .screen')).toBeNull();
  });

  it('captions every variant with its own key', () => {
    for (const variant of VARIANTS) {
      render(variant);
      expect(fixture.componentInstance.captionKey).toBe(
        `MAINTENANCE.GLYPH_${variant.toUpperCase()}`
      );
      const caption = element.querySelector('figure > figcaption');
      expect(caption?.classList).toContain('tag');
      expect(caption?.textContent?.trim()).toBe(CAPTIONS[variant]);
    }
  });

  it('places exactly one accent marker on every strip', () => {
    for (const variant of VARIANTS) {
      render(variant);
      const markers = element.querySelectorAll('circle.glyph__marker');
      expect(markers.length).withContext(variant).toBe(1);
      expect(markers[0].getAttribute('r')).toBe('5');
    }
  });

  it('labels each strip in mono with axis units and tags only', () => {
    for (const variant of VARIANTS) {
      render(variant);
      const tags = Array.from(element.querySelectorAll<SVGTextElement>('text.figure-tag'));
      expect(tags.map((text) => text.textContent?.trim()))
        .withContext(variant)
        .toEqual(LABELS[variant]);
      // The root svg strokes every line; text must not inherit that stroke.
      for (const text of tags) {
        expect(getComputedStyle(text).stroke).withContext(variant).toBe('none');
      }
    }
  });

  it('keeps the past records on the asset strip as ink rings', () => {
    for (const variant of VARIANTS) {
      render(variant);
      expect(element.querySelectorAll('circle.glyph__ring').length)
        .withContext(variant)
        .toBe(variant === 'asset' ? 3 : 0);
    }
  });

  it('projects the current event onto the shared axis', () => {
    for (const variant of VARIANTS) {
      render(variant);
      expect(svg()?.querySelector('[stroke-dasharray]')).withContext(variant).not.toBeNull();
    }
  });
});
