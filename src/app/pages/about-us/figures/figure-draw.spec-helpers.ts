/**
 * Readers for the figure draw-in contract (styles/components.scss): every
 * drawn element carries pathLength="1" and its place in the drawing order
 * in --i, and the svg declares --steps, the last index, from which
 * figure.scss derives --draw-end for the accent and the tags that follow.
 */

function customProperty(element: SVGElement, name: string): string {
  return element.style.getPropertyValue(name).trim();
}

/** The --i of each element, in the order given; fails on any element outside the contract. */
export function drawOrder(elements: SVGElement[]): number[] {
  return elements.map((element) => {
    expect(element.getAttribute('pathLength')).withContext(element.outerHTML).toBe('1');
    const index = Number(customProperty(element, '--i'));
    expect(Number.isInteger(index)).withContext(element.outerHTML).toBeTrue();
    return index;
  });
}

/** The declared --steps: the last drawing index. */
export function steps(element: SVGElement): number {
  const value = customProperty(element, '--steps');
  expect(value).toMatch(/^\d+$/);
  return Number(value);
}
