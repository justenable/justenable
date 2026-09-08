import { Component, Input } from '@angular/core';

/** Closing plate on every page: one sentence and the primary contact button. */
@Component({
  selector: 'app-cta-band',
  templateUrl: './cta-band.component.html',
  styleUrl: './cta-band.component.scss',
  standalone: false,
})
export class CtaBandComponent {
  @Input({ required: true }) textKey!: string;
  @Input() textParams?: Record<string, unknown>;
}
