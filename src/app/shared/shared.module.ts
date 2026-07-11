import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LottieComponent } from 'ngx-lottie';
import { ClickElsewhereDirective } from '../directives/click-elsewhere.directive';

@NgModule({
  declarations: [ClickElsewhereDirective],
  imports: [
    CommonModule,
    FormsModule,
    LottieComponent,
    TranslateModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    LottieComponent,
    TranslateModule,
    ReactiveFormsModule,
    RouterModule,
    ClickElsewhereDirective,
  ],
  // HttpClient is only provided here (AppModule imports SharedModule);
  // the TranslateHttpLoader depends on it. Move to AppModule before
  // removing it here.
  providers: [provideHttpClient(withInterceptorsFromDi())],
})
export class SharedModule {}
