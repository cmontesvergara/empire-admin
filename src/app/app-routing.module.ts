import { Component, NgModule } from '@angular/core';
import { ActivatedRoute, Router, RouterModule, Routes } from '@angular/router';
import { isLoggedGuard } from './core/guards/is-logged/is-logged.guard';

@Component({
  template: '',
  standalone: true,
})
class RootComponent {
  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe((params) => {
      const appId = params['app_id'];
      const redirectUri = params['redirect_uri'];

      if (appId && redirectUri) {
        // App-initiated flow - redirect to tenant selector
        this.router.navigate(['/dashboard/select-tenant'], {
          queryParams: { app_id: appId, redirect_uri: redirectUri },
        });
      } else {
        // Normal flow - go to dashboard
        this.router.navigate(['/dashboard']);
      }
    });
  }
}

const routes: Routes = [
  {
    path: '',
    component: RootComponent,
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    canActivate: [isLoggedGuard],
    loadChildren: () =>
      import('./modules/sso-dashboard/sso-dashboard.module').then(
        (m) => m.SsoDashboardModule,
      ),
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
    path: 'admin',
    canActivate: [isLoggedGuard],
    loadChildren: () =>
      import('./modules/admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: 'profile',
    // canActivate: [isLoggedGuard],
    loadChildren: () =>
      import('./modules/profile/profile.module').then((m) => m.ProfileModule),
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
