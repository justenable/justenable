import { Component, Input } from '@angular/core';
import { ServiceCardMedia } from 'src/app/models/service-card.model';

/**
 * One of the four services on the home page: a label plate with a 4:3 media
 * slot (a photo or the ladder figure) above the tag, name and description.
 * Not a link, since no per-service page exists: hover only firms up the
 * plate edge and lets the media breathe inside its slot.
 */
@Component({
  selector: 'app-service-card',
  templateUrl: './service-card.component.html',
  styleUrl: './service-card.component.scss',
  standalone: false,
})
export class ServiceCardComponent {
  @Input({ required: true }) tag!: string;
  @Input({ required: true }) titleKey!: string;
  @Input({ required: true }) descriptionKey!: string;
  @Input({ required: true }) media!: ServiceCardMedia;
}
