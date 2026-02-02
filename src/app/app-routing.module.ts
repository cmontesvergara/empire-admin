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
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'dashboard',
    canActivateChild: [isLoggedGuard],
    loadChildren: () =>
      import('./modules/logged-layout/logged-layout.module').then(
        (m) => m.LoggedLayoutModule,
      ),
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
export class AppRoutingModule { }
