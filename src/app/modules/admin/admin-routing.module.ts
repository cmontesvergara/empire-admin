import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { systemAdminGuard } from '../../core/guards/system-admin.guard';
import { ApplicationsComponent } from './pages/applications/applications.component';

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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
