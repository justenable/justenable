import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { AutomationRoutingModule } from './automation-routing.module';
import { AutomationComponent } from './automation.component';
import { IntegrationFigureComponent } from './figures/integration-figure.component';
import { LoopFigureComponent } from './figures/loop-figure.component';
import { ProcessFigureComponent } from './figures/process-figure.component';
import { RackFigureComponent } from './figures/rack-figure.component';

export const AUTOMATION_FIGURES = [
  ProcessFigureComponent,
  LoopFigureComponent,
  RackFigureComponent,
  IntegrationFigureComponent,
];

@NgModule({
  declarations: [AutomationComponent, ...AUTOMATION_FIGURES],
  imports: [AutomationRoutingModule, SharedModule],
})
export class AutomationModule {}
