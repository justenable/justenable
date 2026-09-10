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

const OUTCOMES: Record<GlyphVariant, string> = {
  preventive: 'Problems found while they are still small',
  corrective: 'Back in production sooner after a breakdown',
  predictive: 'Repairs planned before the machine stops',
  asset: 'One record of every asset you own',
  facility: 'The building keeps working for your people',
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

/**
 * Where the marker slides in from: the offset back from its documented
 * position to the start of its own strip line. The predictive marker
 * travels the trend line instead, through its own keyframes.
 */
const SLIDE_X: Record<Exclude<GlyphVariant, 'predictive'>, string> = {
  preventive: '-224px',
  corrective: '-320px',
  asset: '-368px',
  facility: '-216px',
};

function customProperty(element: Element, name: string): string {
  return (element as SVGElement).style.getPropertyValue(name).trim();
}

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

  function strokes(): SVGElement[] {
    return Array.from(element.querySelectorAll<SVGElement>('svg :is(line, path, polyline, circle)'));
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
      'MAINTENANCE.GLYPH_PREVENTIVE_OUTCOME': OUTCOMES.preventive,
      'MAINTENANCE.GLYPH_CORRECTIVE_OUTCOME': OUTCOMES.corrective,
      'MAINTENANCE.GLYPH_PREDICTIVE_OUTCOME': OUTCOMES.predictive,
      'MAINTENANCE.GLYPH_ASSET_OUTCOME': OUTCOMES.asset,
      'MAINTENANCE.GLYPH_FACILITY_OUTCOME': OUTCOMES.facility,
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

  it('captions every variant with its own key, outcome first', () => {
    for (const variant of VARIANTS) {
      render(variant);
      expect(fixture.componentInstance.captionKey).toBe(
        `MAINTENANCE.GLYPH_${variant.toUpperCase()}`
      );
      expect(fixture.componentInstance.outcomeKey).toBe(
        `MAINTENANCE.GLYPH_${variant.toUpperCase()}_OUTCOME`
      );
      const caption = element.querySelector('figure > figcaption');
      const outcome = caption?.querySelector('span');
      expect(outcome?.textContent?.trim()).withContext(variant).toBe(OUTCOMES[variant]);
      expect(outcome?.classList).toContain('text-body-s');
      const mechanism = caption?.querySelector('.tag');
      expect(mechanism?.textContent?.trim()).withContext(variant).toBe(CAPTIONS[variant]);
    }
  });

  it('places exactly one accent marker on every strip', () => {
    for (const variant of VARIANTS) {
      render(variant);
      const markers = element.querySelectorAll('circle.glyph__marker');
      expect(markers.length).withContext(variant).toBe(1);
      expect(markers[0].getAttribute('r')).toBe('5');
      expect(markers[0].hasAttribute('pathLength')).withContext(variant).toBeFalse();
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
      expect(svg()?.querySelector('.glyph__projection[stroke-dasharray]'))
        .withContext(variant)
        .not.toBeNull();
    }
  });

  it('draws every solid stroke through the figure draw-in contract, strip before axis', () => {
    for (const variant of VARIANTS) {
      render(variant);
      const drawn = strokes().filter(
        (stroke) =>
          !stroke.classList.contains('glyph__marker') &&
          !stroke.classList.contains('glyph__projection')
      );
      expect(drawn.length).withContext(variant).toBeGreaterThan(2);
      const order = drawn.map((stroke) => {
        expect(stroke.getAttribute('pathLength')).withContext(stroke.outerHTML).toBe('1');
        const index = Number(customProperty(stroke, '--i'));
        expect(Number.isInteger(index)).withContext(stroke.outerHTML).toBeTrue();
        return index;
      });
      for (let i = 1; i < order.length; i++) {
        expect(order[i]).withContext(`${variant} element ${i}`).toBeGreaterThan(order[i - 1]);
      }
      // The axis at y=152 is the last line drawn before the marker arrives.
      const axis = drawn.find((stroke) => stroke.getAttribute('y1') === '152');
      expect(axis).withContext(variant).toBeDefined();
      expect(order.indexOf(Number(customProperty(axis!, '--i')))).toBe(order.length - 2);

      // --steps is the last index; the component style derives --draw-end from it.
      const strip = svg()?.querySelector<SVGGElement>('svg > g');
      expect(customProperty(strip!, '--steps')).withContext(variant).toBe(String(Math.max(...order)));
    }
  });

  it('slides the marker in along its strip, or along the trend on the predictive strip', () => {
    for (const variant of VARIANTS) {
      render(variant);
      const slide = element.querySelector<SVGGElement>('g.glyph__slide');
      expect(slide?.querySelector('circle.glyph__marker')).withContext(variant).not.toBeNull();
      if (variant === 'predictive') {
        expect(slide?.classList).toContain('glyph__slide--trend');
        expect(customProperty(slide!, '--slide-x')).toBe('');
      } else {
        expect(slide?.classList).not.toContain('glyph__slide--trend');
        expect(customProperty(slide!, '--slide-x')).withContext(variant).toBe(SLIDE_X[variant]);
      }
    }
  });

  it('holds the projections back until the marker has settled, never drawing a dashed line', () => {
    for (const variant of VARIANTS) {
      render(variant);
      const dashed = strokes().filter((stroke) => stroke.hasAttribute('stroke-dasharray'));
      const projections = strokes().filter((stroke) =>
        stroke.classList.contains('glyph__projection')
      );
      expect(dashed.length).withContext(variant).toBeGreaterThan(0);
      for (const stroke of dashed) {
        expect(stroke.classList).withContext(stroke.outerHTML).toContain('glyph__projection');
      }
      for (const stroke of projections) {
        expect(stroke.hasAttribute('pathLength')).withContext(stroke.outerHTML).toBeFalse();
      }
      // The predicted failure is part of the projection, dashed lines and the x alike.
      expect(projections.length).toBe(variant === 'predictive' ? 4 : dashed.length);
    }
  });
});
