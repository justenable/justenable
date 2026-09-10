/**
 * Replaces document.startViewTransition with a fake that runs the update
 * callback and resolves at once. The router only needs the callback to run;
 * the animations are CSS, and a real transition skipped by the next
 * navigation would reject `ready` and log a DOMException. Returns the spy;
 * each fake transition's `skipTransition` is a spy too, reachable through
 * `calls.mostRecent().returnValue`.
 */
export function stubViewTransition(): jasmine.Spy<typeof document.startViewTransition> {
  return spyOn(document, 'startViewTransition').and.callFake(
    (update?: ViewTransitionUpdateCallback | StartViewTransitionOptions) => {
      const callback = typeof update === 'function' ? update : update?.update;
      void Promise.resolve().then(() => callback?.());
      return {
        ready: Promise.resolve(),
        finished: Promise.resolve(),
        updateCallbackDone: Promise.resolve(),
        skipTransition: jasmine.createSpy('skipTransition'),
      } as unknown as ViewTransition;
    }
  );
}
