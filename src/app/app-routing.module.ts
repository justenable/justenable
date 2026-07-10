import { NgModule } from '@angular/core';
import { RouterModule, Routes, TitleStrategy } from '@angular/router';
import { TranslatedTitleStrategy } from './services/translated-title.strategy';

const routes: Routes = [
  {
    path: 'about-us',
    title: 'NAVIGATION.ABOUT_US',
    loadChildren: () =>
      import('./pages/about-us/about-us.module').then((m) => m.AboutUsModule),
  },
  {
    path: 'automation',
    title: 'NAVIGATION.AUTOMATION',
    loadChildren: () =>
      import('./pages/automation/automation.module').then(
        (m) => m.AutomationModule
      ),
  },
  {
    path: '',
    title: 'NAVIGATION.HOME',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'maintenance',
    title: 'NAVIGATION.MAINTENANCE',
    loadChildren: () =>
      import('./pages/maintenance/maintenance.module').then(
        (m) => m.MaintenanceModule
      ),
  },
  {
    path: 'contact-us',
    title: 'NAVIGATION.CONTACT_US',
    loadChildren: () =>
      import('./pages/contact-us/contact-us.module').then(
        (m) => m.ContactUsModule
      ),
  },
  {
    path: '**',
    title: 'NOT_FOUND.TITLE',
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [{ provide: TitleStrategy, useClass: TranslatedTitleStrategy }],
})
export class AppRoutingModule {}
