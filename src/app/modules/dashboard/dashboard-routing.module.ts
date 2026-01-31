import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { systemAdminGuard } from 'src/app/core/guards/system-admin.guard';
import { HomeComponent } from '../home/home.component';
import { DashboardComponent } from './dashboard.component';
import { ApplicationsComponent } from './pages/applications/applications.component';
import { NftComponent } from './pages/nft/nft.component';
import { RolesComponent } from './pages/roles/roles.component';
import { TenantSelectorComponent } from './pages/tenant-selector/tenant-selector.component';
import { TenantsComponent } from './pages/tenants/tenants.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,

    children: [
      { path: '', redirectTo: 'nfts', pathMatch: 'full' },
      { path: 'nfts', component: NftComponent },
      {
        path: 'applications',
        component: ApplicationsComponent,
        canActivate: [systemAdminGuard],
      },
      {
        path: 'tenants',
        component: TenantsComponent,
        // Any logged user can view tenants (they see only their tenants)
        // System admins can create new tenants
      },
      {
        path: 'roles/:tenantId',
        component: RolesComponent,
        // Any tenant member can view roles
        // Only tenant admins can manage roles
      },
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'select-tenant',
        component: TenantSelectorComponent,
      },
      {
        path: 'profile',
        // canActivate: [isLoggedGuard],
        loadChildren: () =>
          import('../profile/profile.module').then((m) => m.ProfileModule),
      },
      { path: '**', redirectTo: 'errors/404' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
