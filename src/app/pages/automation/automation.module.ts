import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { AutomationRoutingModule } from './automation-routing.module';
import { AutomationComponent } from './automation.component';

@NgModule({
  declarations: [AutomationComponent],
  imports: [AutomationRoutingModule, SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AutomationModule {}
