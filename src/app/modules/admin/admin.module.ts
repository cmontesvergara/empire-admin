import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AdminRoutingModule } from './admin-routing.module';
import { ApplicationsComponent } from './pages/applications/applications.component';
import { TenantsComponent } from './pages/tenants/tenants.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ApplicationsComponent, // Import standalone component
    TenantsComponent, // Import standalone component
  ],
})
export class AdminModule {}
