import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { LadderFigureComponent } from './ladder-figure/ladder-figure.component';
import { MimicComponent } from './mimic/mimic.component';
import { ServiceCardComponent } from './service-card/service-card.component';

@NgModule({
  declarations: [
    HomeComponent,
    MimicComponent,
    ServiceCardComponent,
    LadderFigureComponent,
  ],
  imports: [HomeRoutingModule, SharedModule],
})
export class HomeModule {}
