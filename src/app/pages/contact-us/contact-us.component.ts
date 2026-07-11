import { Component } from '@angular/core';

@Component({
    selector: 'app-contact-us',
    templateUrl: './contact-us.component.html',
    styleUrls: ['./contact-us.component.scss'],
    standalone: false
})
export class ContactUsComponent {
  email = 'info@justenable.co.za';
  mobile = '+27 87 265 2874';
  phone = '+27 72 848 6786';
  location =
    '68 Glenwood Rd, Lynnwood Glen, Pretoria, 0081, South Africa';
  locationLink = 'https://goo.gl/maps/fc5xF1pbYNjvLxGg8';
}
