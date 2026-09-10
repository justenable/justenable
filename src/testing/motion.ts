/**
 * Answers the reduced-motion query for a spec and leaves every other query
 * to the browser, so a reveal assertion does not depend on the machine's
 * accessibility settings. Call before the fixture is created.
 */
export function stubReducedMotion(reduced: boolean): void {
  const matchMedia = window.matchMedia.bind(window);
  spyOn(window, 'matchMedia').and.callFake((query: string) =>
    query === '(prefers-reduced-motion: reduce)'
      ? ({ matches: reduced } as MediaQueryList)
      : matchMedia(query)
  );
}
