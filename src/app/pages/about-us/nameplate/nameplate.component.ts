import { Component } from '@angular/core';
import { CONTACT } from 'src/app/shared/contact';

/**
 * The engraved nameplate on the "Our story" row: the mark and four facts
 * (company, motto, location, contact). Every value comes from CONTACT or a
 * translation key; nothing is invented (no revision, date or drawn-by).
 */
@Component({
  selector: 'app-nameplate',
  templateUrl: './nameplate.component.html',
  styleUrl: './nameplate.component.scss',
  standalone: false,
})
export class NameplateComponent {
  readonly company = 'Just Enable';
  readonly email = CONTACT.email;
  readonly location = CONTACT.locality;
}
