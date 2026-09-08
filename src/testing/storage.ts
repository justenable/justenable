export type StorageName = 'localStorage' | 'sessionStorage';

/**
 * Makes the Web Storage accessor throw the way Safari's "Block all cookies"
 * does. Jasmine only removes the spy after afterEach has run, where specs
 * clean their keys up, so call the returned function at the end of the test.
 */
export function blockStorage(...names: StorageName[]): () => void {
  const spies = names.map((name) =>
    spyOnProperty(window, name, 'get').and.throwError(
      new DOMException('blocked', 'SecurityError')
    )
  );
  return () => spies.forEach((spy) => spy.and.callThrough());
}
