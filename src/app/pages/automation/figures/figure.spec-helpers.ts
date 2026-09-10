/**
 * The draw-in contract every automation figure honours (components.scss,
 * `.figure.is-revealed`): each stroked element either draws, carrying
 * `pathLength="1"` so one dash is the whole line and `--i`, its place in the
 * drawing order, or is `.figure-late` (a dotted line, which cannot draw that
 * way, and its arrowhead) and fades in with the tags through `_figure.scss`.
 * The svg's `--steps` is the last index, so the late elements, the accent
 * and the tags wait for the slowest line. The accent marker itself fades in
 * and never draws.
 */
const STROKED = 'line, path, rect, circle, ellipse, polyline, polygon';

function index(element: Element): number {
  const raw = (element as SVGElement).style.getPropertyValue('--i').trim();
  expect(raw).withContext(`${element.outerHTML} has no --i`).toMatch(/^\d+$/);
  return Number(raw);
}

export function expectDrawContract(svg: SVGSVGElement): void {
  const stroked = Array.from(svg.querySelectorAll(STROKED)).filter(
    (element) => !element.classList.contains('dot') && !element.classList.contains('figure-marker')
  );
  expect(stroked.length).toBeGreaterThan(0);

  const late = stroked.filter((element) => element.classList.contains('figure-late'));
  const drawn = stroked.filter((element) => !late.includes(element));
  for (const element of late) {
    expect(element.hasAttribute('pathLength')).withContext(element.outerHTML).toBeFalse();
    expect((element as SVGElement).style.getPropertyValue('--i')).toBe('');
  }
  for (const element of drawn) {
    expect(element.getAttribute('pathLength')).withContext(element.outerHTML).toBe('1');
  }
  const indices = drawn.map(index);

  const last = Math.max(...indices);
  for (let i = 0; i <= last; i++) {
    expect(indices).withContext(`no stroke draws at step ${i}`).toContain(i);
  }
  expect(svg.style.getPropertyValue('--steps').trim()).toBe(String(last));

  const marker = svg.querySelector('.figure-marker');
  expect(marker?.hasAttribute('pathLength')).toBeFalse();
  expect(svg.querySelectorAll('.dot[pathLength]').length).toBe(0);
}
