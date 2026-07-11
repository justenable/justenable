import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone: false
})
export class HeaderComponent implements OnInit {
  navigation: { title: string; url: string }[] = [
    {
      title: 'NAVIGATION.HOME',
      url: '',
    },
    {
      title: 'NAVIGATION.AUTOMATION',
      url: '/automation',
    },
    {
      title: 'NAVIGATION.MAINTENANCE',
      url: '/maintenance',
    },
    {
      title: 'NAVIGATION.ABOUT_US',
      url: '/about-us',
    },
    {
      title: 'NAVIGATION.CONTACT_US',
      url: '/contact-us',
    },
  ];

  languages = environment.languages;
  selected: string = '';
  hideLanguageList: boolean = true;
  showMenu: boolean = false;

  constructor(private translate: TranslateService) {}

  ngOnInit() {
    this.setSelected(this.translate.currentLang || this.translate.defaultLang);
    this.translate.onLangChange.subscribe(({ lang }) => this.setSelected(lang));
  }

  setLanguage(language: string) {
    this.hideLanguageList = true;
    this.translate.use(language.toLowerCase());
  }

  toggleLanguageList() {
    this.hideLanguageList = !this.hideLanguageList;

    if (!this.hideLanguageList && this.showMenu) {
      this.showMenu = false;
    }
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;

    if (this.showMenu && !this.hideLanguageList) {
      this.hideLanguageList = true;
    }
  }

  private setSelected(lang: string) {
    this.selected = (lang || 'en').toUpperCase();
  }
}
