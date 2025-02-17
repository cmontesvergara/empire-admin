import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoggedLayoutComponent } from './logged-layout.component';

const routes: Routes = [


  {
    path: '',
   redirectTo: 'home', pathMatch: 'full'},
  {
    path: 'home',
    component: LoggedLayoutComponent,
    loadChildren: () => import('../dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'profile',
    component: LoggedLayoutComponent,
    loadChildren: () => import('../profile/profile.module').then((m) => m.ProfileModule),
  },
  {
    path: 'components',
    component: LoggedLayoutComponent,
    loadChildren: () => import('../uikit/uikit.module').then((m) => m.UikitModule),
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'error/404' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoggedLayoutRoutingModule {}
