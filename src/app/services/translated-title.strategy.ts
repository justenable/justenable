import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

@Injectable()
export class TranslatedTitleStrategy extends TitleStrategy {
  private lastTitleKey?: string;

  constructor(
    private readonly title: Title,
    private readonly translate: TranslateService,
    private readonly meta: Meta,
    @Inject(DOCUMENT) private readonly document: Document
  ) {
    super();
    // Re-apply the current route title when the user switches language.
    this.translate.onLangChange.subscribe(() => this.applyTitle());
  }

  override updateTitle(snapshot: RouterStateSnapshot): void {
    this.lastTitleKey = this.buildTitle(snapshot);
    this.applyTitle();
    this.updateCanonicalUrl(snapshot.url);
  }

  // The static tags in index.html only cover the homepage; keep the
  // canonical and og:url in sync with the actual route so crawlers
  // don't consolidate every page onto '/'.
  private updateCanonicalUrl(url: string): void {
    const path = url.split('?')[0].split('#')[0];
    const canonicalUrl = environment.siteUrl + path;
    let link = this.document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]'
    );
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', canonicalUrl);
    this.meta.updateTag({ property: 'og:url', content: canonicalUrl });
  }

  private applyTitle(): void {
    if (!this.lastTitleKey) {
      this.title.setTitle('Just Enable');
      return;
    }
    this.translate
      .get(this.lastTitleKey)
      .subscribe((translated) =>
        this.title.setTitle(`${translated} | Just Enable`)
      );
  }
}
