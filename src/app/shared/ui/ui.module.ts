import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LampComponent } from './lamp/lamp.component';
import { LogoComponent } from './logo/logo.component';

// Small presentational primitives (lamp, logo) shared by the app shell and
// the pages. Declared here so SharedModule can re-export them.
@NgModule({
  declarations: [LampComponent, LogoComponent],
  imports: [CommonModule],
  exports: [LampComponent, LogoComponent],
})
export class UiModule {}
