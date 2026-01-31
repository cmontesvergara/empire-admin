import { NgModule } from '@angular/core';

import { AngularSvgIconModule } from 'angular-svg-icon';
import { DashboardRoutingModule } from './dashboard-routing.module';

@NgModule({
  imports: [DashboardRoutingModule, AngularSvgIconModule.forRoot()],
})
export class DashboardModule {}
