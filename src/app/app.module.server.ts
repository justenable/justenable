import { NgModule } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { TranslateLoader } from '@ngx-translate/core';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { serverRoutes } from './app.routes.server';
import { ServerTranslateLoader } from './services/server-translate.loader';

@NgModule({
  imports: [AppModule],
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    { provide: TranslateLoader, useClass: ServerTranslateLoader },
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
