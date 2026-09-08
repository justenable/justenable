import { Component, Input } from '@angular/core';

export interface ContentsItem {
  /** Fragment of the target H2, e.g. `a-01`. */
  id: string;
  /** Locale-invariant marker shown before the name, e.g. `A-01`. */
  tag: string;
  /** Translation key of the section title. */
  key: string;
}

/** Page header of every inner page; the only thing that renders an H1 there. */
@Component({
  selector: 'app-title-block',
  templateUrl: './title-block.component.html',
  styleUrl: './title-block.component.scss',
  standalone: false,
})
export class TitleBlockComponent {
  @Input() tag?: string;
  @Input({ required: true }) eyebrowKey!: string;
  @Input({ required: true }) titleKey!: string;
  @Input() titleParams?: Record<string, unknown>;
  @Input() leadKey?: string;
  @Input() leadParams?: Record<string, unknown>;
  @Input() contents?: ContentsItem[];
}
