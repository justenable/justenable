import { SITE_INDEX, sitePage } from './site-index';

describe('SITE_INDEX', () => {
  it('lists the two service pages in navigation order', () => {
    expect(SITE_INDEX.map((page) => page.url)).toEqual(['/automation', '/maintenance']);
    expect(SITE_INDEX.map((page) => page.pageKey)).toEqual([
      'NAVIGATION.AUTOMATION',
      'NAVIGATION.MAINTENANCE',
    ]);
  });

  it('numbers A-01 to A-04 and M-01 to M-05, each id the lower-case tag', () => {
    const [automation, maintenance] = SITE_INDEX;
    expect(automation.sections.map((section) => section.tag)).toEqual([
      'A-01',
      'A-02',
      'A-03',
      'A-04',
    ]);
    expect(maintenance.sections.map((section) => section.tag)).toEqual([
      'M-01',
      'M-02',
      'M-03',
      'M-04',
      'M-05',
    ]);
    for (const page of SITE_INDEX) {
      for (const section of page.sections) {
        expect(section.id).toBe(section.tag.toLowerCase());
        expect(section.key).toMatch(/^GLOBAL\.[A-Z_]+$/);
      }
    }
  });

  it('never repeats a fragment or a key across the site', () => {
    const sections = SITE_INDEX.flatMap((page) => page.sections);
    expect(new Set(sections.map((section) => section.id)).size).toBe(sections.length);
    expect(new Set(sections.map((section) => section.key)).size).toBe(sections.length);
  });

  it('looks a page up by its route and refuses an unknown one', () => {
    expect(sitePage('/maintenance')).toBe(SITE_INDEX[1]);
    expect(() => sitePage('/about-us')).toThrowError(/about-us/);
  });
});
