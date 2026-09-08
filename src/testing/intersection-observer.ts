/**
 * A hand-driven IntersectionObserver for specs. Real observers fire on the
 * browser's own schedule and only for what the test viewport actually shows,
 * so the "left the viewport" branches can never be reached with one.
 * `install()` in beforeEach, `restore()` in afterEach.
 */
export class FakeIntersectionObserver implements IntersectionObserver {
  static instances: FakeIntersectionObserver[] = [];
  private static real?: typeof IntersectionObserver;

  readonly root = null;
  readonly rootMargin: string;
  readonly thresholds: readonly number[];
  readonly observed: Element[] = [];
  readonly disconnect = jasmine.createSpy('disconnect');

  constructor(
    private readonly callback: IntersectionObserverCallback,
    readonly init?: IntersectionObserverInit
  ) {
    this.rootMargin = init?.rootMargin ?? '0px';
    this.thresholds = ([] as number[]).concat(init?.threshold ?? 0);
    FakeIntersectionObserver.instances.push(this);
  }

  static install(): void {
    FakeIntersectionObserver.real = window.IntersectionObserver;
    FakeIntersectionObserver.instances = [];
    window.IntersectionObserver =
      FakeIntersectionObserver as unknown as typeof IntersectionObserver;
  }

  static restore(): void {
    if (FakeIntersectionObserver.real) {
      window.IntersectionObserver = FakeIntersectionObserver.real;
    }
    FakeIntersectionObserver.instances = [];
  }

  observe(target: Element): void {
    this.observed.push(target);
  }

  unobserve(target: Element): void {
    this.observed.splice(this.observed.indexOf(target), 1);
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  /** Delivers one entry the way the real observer would. */
  trigger(entry: Partial<IntersectionObserverEntry>): void {
    this.callback([entry as IntersectionObserverEntry], this);
  }
}
