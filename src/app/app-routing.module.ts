import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { isLoggedGuard } from './core/guards/is-logged/is-logged.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    canActivate: [isLoggedGuard],
    loadChildren: () =>
      import('./modules/logged-layout/logged-layout.module').then((m) => m.LoggedLayoutModule),
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./modules/unlogged-layout/unlogged-layout.module').then(
        (m) => m.UnloggedLayoutModule,
      ),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'apps',
    loadChildren: () =>
      import('./modules/apps/apps.module').then((m) => m.AppsModule),
  },
  {
    path: 'errors',
    loadChildren: () =>
      import('./modules/error/error.module').then((m) => m.ErrorModule),
  },
  { path: '**', redirectTo: 'errors/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
