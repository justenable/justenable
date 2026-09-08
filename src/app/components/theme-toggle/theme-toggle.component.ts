import { booleanAttribute, Component, inject, Input } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.service';

let nextId = 0;

/**
 * The rocker. I = dark mode enabled = aria-pressed="true": in enable-bit
 * terms the switch enables night mode, and the visible state and the ARIA
 * state agree. Consumes ThemeService and nothing else.
 */
@Component({
  selector: 'app-theme-toggle',
  standalone: false,
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss'],
})
export class ThemeToggleComponent {
  /** Panel variant: a visible "Dark mode" label on the left, linked with aria-labelledby. */
  @Input({ transform: booleanAttribute }) labelled = false;

  readonly theme = inject(ThemeService);
  readonly labelId = `theme-toggle-label-${nextId++}`;
}
