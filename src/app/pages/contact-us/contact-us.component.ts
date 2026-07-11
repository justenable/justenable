import { Component } from '@angular/core';

@Component({
    selector: 'app-contact-us',
    templateUrl: './contact-us.component.html',
    styleUrls: ['./contact-us.component.scss'],
    standalone: false
})
export class ContactUsComponent {
  email: string = 'info@justenable.co.za';
  mobile: string = '+27 87 265 2874';
  phone: string = '+27 72 848 6786';
  location: string =
    '68 Glenwood Rd, Lynnwood Glen, Pretoria, 0081, South Africa';
  locationLink: string = 'https://goo.gl/maps/fc5xF1pbYNjvLxGg8';
}
