import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaintenanceRoutingModule } from './maintenance-routing.module';
import { MaintenanceComponent } from './maintenance.component';
import { TimelineGlyphComponent } from './timeline-glyph/timeline-glyph.component';

@NgModule({
  declarations: [MaintenanceComponent, TimelineGlyphComponent],
  imports: [MaintenanceRoutingModule, SharedModule],
})
export class MaintenanceModule {}
