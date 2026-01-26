import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { TenantSelectorComponent } from './pages/tenant-selector/tenant-selector.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: DashboardComponent
  },
  {
    path: 'select-tenant',
    component: TenantSelectorComponent
  }
];

@NgModule({
  declarations: [
    DashboardComponent,
    TenantSelectorComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class SsoDashboardModule { }
