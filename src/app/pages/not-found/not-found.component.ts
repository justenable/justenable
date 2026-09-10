import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

/**
 * The only page where the enable bit is 0, so the only unlit lamp outside a
 * nav or menu list. Client-rendered behind the Netlify SPA fallback.
 */
@Component({
  selector: 'app-not-found',
  imports: [SharedModule],
  templateUrl: './not-found.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './not-found.component.scss',
})
export class NotFoundComponent {}
