import { Component, Input, numberAttribute } from '@angular/core';

/**
 * The JE mark. je-logo.webp is opaque white, so it sits on a white label
 * plate, which reads as an engraved nameplate in both themes. Put aria-hidden
 * on the host when it stands next to the wordmark text.
 */
@Component({
  selector: 'app-logo',
  standalone: false,
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss'],
})
export class LogoComponent {
  /** Height of the mark itself in CSS px (header 32, footer 28, nameplate 24). */
  @Input({ transform: numberAttribute }) height = 32;
}
