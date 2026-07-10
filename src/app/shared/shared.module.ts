import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LottieModule } from 'ngx-lottie';
import { ClickElsewhereDirective } from '../directives/click-elsewhere.directive';

@NgModule({
  declarations: [ClickElsewhereDirective],
  imports: [
    CommonModule,
    FormsModule,
    LottieModule,
    TranslateModule,
    // HttpClient is only provided through this import (AppModule imports
    // SharedModule); the TranslateHttpLoader depends on it. Move to
    // AppModule before removing it here.
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule,
  ],

  exports: [
    CommonModule,
    FormsModule,
    LottieModule,
    TranslateModule,
    ReactiveFormsModule,
    RouterModule,
    ClickElsewhereDirective,
  ],
})
export class SharedModule {}
