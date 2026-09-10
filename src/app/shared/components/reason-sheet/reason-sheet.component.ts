import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { TitledText } from 'src/app/models/titled-text.model';

/**
 * Numbered sheet of reasons, the way a commissioning pack lists items. Both
 * the table (md and up) and the definition list (below md) are rendered and
 * switched with CSS so no viewport is read at render time.
 */
@Component({
  selector: 'app-reason-sheet',
  templateUrl: './reason-sheet.component.html',
  styleUrl: './reason-sheet.component.scss',
  standalone: false,
  // `id` belongs to the H2 (the fragment target). Angular keeps a static
  // `id="a-05"` written on the host in the DOM as well, so without this the
  // page would carry two elements with that id and the anchor would land on
  // the host instead of the heading. The spec exercises the static form.
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { '[attr.id]': 'null' },
})
export class ReasonSheetComponent {
  @Input({ required: true }) tag!: string;
  @Input({ required: true }) id!: string;
  @Input({ required: true }) titleKey!: string;
  @Input() titleParams?: Record<string, unknown>;
  @Input() items: TitledText[] | null = null;

  itemNo(index: number): string {
    return String(index + 1).padStart(2, '0');
  }
}
