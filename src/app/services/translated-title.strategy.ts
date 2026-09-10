import { Inject, Injectable, DOCUMENT } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

const SITE_NAME = 'Just Enable';

@Injectable()
export class TranslatedTitleStrategy extends TitleStrategy {
  private lastTitleKey?: string;
  private lastDescriptionKey?: string;

  constructor(
    private readonly title: Title,
    private readonly translate: TranslateService,
    private readonly meta: Meta,
    @Inject(DOCUMENT) private readonly document: Document
  ) {
    super();
    // Re-apply the current route's copy when the user switches language.
    this.translate.onLangChange.subscribe(() => this.applyRouteCopy());
  }

  override updateTitle(snapshot: RouterStateSnapshot): void {
    this.lastTitleKey = this.buildTitle(snapshot);
    this.lastDescriptionKey = descriptionKey(snapshot.root);
    this.applyRouteCopy();
    if (isNotFound(snapshot.root)) {
      this.markNotFound();
    } else {
      this.meta.removeTag('name="robots"');
      this.updateCanonicalUrl(snapshot.url);
    }
  }

  // The static tags in index.html only cover the homepage; keep the
  // canonical and og:url in sync with the actual route so crawlers
  // don't consolidate every page onto '/'.
  private updateCanonicalUrl(url: string): void {
    const path = url.split('?')[0].split('#')[0];
    const canonicalUrl = environment.siteUrl + path;
    let link = this.canonicalLink();
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', canonicalUrl);
    this.meta.updateTag({ property: 'og:url', content: canonicalUrl });
  }

  // The SPA fallback serves unknown URLs; they must neither be indexed nor
  // canonicalise themselves (or the home page).
  private markNotFound(): void {
    this.meta.updateTag({ name: 'robots', content: 'noindex' });
    this.canonicalLink()?.remove();
    this.meta.removeTag('property="og:url"');
  }

  private canonicalLink(): HTMLLinkElement | null {
    return this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  }

  private applyRouteCopy(): void {
    this.applyTitle();
    this.applyDescription();
  }

  private applyTitle(): void {
    if (!this.lastTitleKey) {
      this.setTitle(SITE_NAME);
      return;
    }
    this.translate
      .get(this.lastTitleKey)
      .subscribe((translated) => this.setTitle(`${translated} | ${SITE_NAME}`));
  }

  // Without a per-route description every page ships the index.html
  // boilerplate, so Google has nothing to tell the snippets apart. The '**'
  // route carries no key: it is already noindex, and the static tags stand.
  private applyDescription(): void {
    const key = this.lastDescriptionKey;
    if (!key) {
      return;
    }
    this.translate.get(key).subscribe((description) => {
      this.meta.updateTag({ name: 'description', content: description });
      this.meta.updateTag({ property: 'og:description', content: description });
      this.meta.updateTag({ name: 'twitter:description', content: description });
    });
  }

  // Social previews read og:title / twitter:title, which index.html only
  // sets for the home page.
  private setTitle(title: string): void {
    this.title.setTitle(title);
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ name: 'twitter:title', content: title });
  }
}

function leafOf(route: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
  let leaf = route;
  while (leaf.firstChild) {
    leaf = leaf.firstChild;
  }
  return leaf;
}

function isNotFound(route: ActivatedRouteSnapshot): boolean {
  return leafOf(route).routeConfig?.path === '**';
}

function descriptionKey(route: ActivatedRouteSnapshot): string | undefined {
  return leafOf(route).data['description'] as string | undefined;
}
