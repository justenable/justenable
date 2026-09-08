import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ClickElsewhereDirective } from '../directives/click-elsewhere.directive';
import { RevealDirective } from '../directives/reveal.directive';
import { CtaBandComponent } from './components/cta-band/cta-band.component';
import { FeatureSectionComponent } from './components/feature-section/feature-section.component';
import { FigureComponent } from './components/figure/figure.component';
import { ReasonSheetComponent } from './components/reason-sheet/reason-sheet.component';
import { TitleBlockComponent } from './components/title-block/title-block.component';
import { UiModule } from './ui/ui.module';

const PAGE_COMPONENTS = [
  TitleBlockComponent,
  FeatureSectionComponent,
  ReasonSheetComponent,
  CtaBandComponent,
  FigureComponent,
];

@NgModule({
  declarations: [ClickElsewhereDirective, RevealDirective, ...PAGE_COMPONENTS],
  imports: [
    CommonModule,
    FormsModule,
    TranslatePipe,
    ReactiveFormsModule,
    RouterModule,
    UiModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    TranslatePipe,
    ReactiveFormsModule,
    RouterModule,
    ClickElsewhereDirective,
    RevealDirective,
    UiModule,
    ...PAGE_COMPONENTS,
  ],
  // HttpClient is only provided here (AppModule imports SharedModule);
  // the TranslateHttpLoader depends on it. Move to AppModule before
  // removing it here.
  providers: [provideHttpClient(withInterceptorsFromDi())],
})
export class SharedModule {}
