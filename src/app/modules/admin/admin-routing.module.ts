import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { systemAdminGuard } from '../../core/guards/system-admin.guard';
import { ApplicationsComponent } from './pages/applications/applications.component';
import { TenantsComponent } from './pages/tenants/tenants.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'applications',
    pathMatch: 'full',
  },
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
