import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { AboutUsRoutingModule } from './about-us-routing.module';
import { AboutUsComponent } from './about-us.component';
import { OfficeFigureComponent } from './figures/office-figure.component';
import { StackFigureComponent } from './figures/stack-figure.component';
import { NameplateComponent } from './nameplate/nameplate.component';

@NgModule({
  declarations: [
    AboutUsComponent,
    NameplateComponent,
    OfficeFigureComponent,
    StackFigureComponent,
  ],
  imports: [AboutUsRoutingModule, SharedModule],
})
export class AboutUsModule {}
