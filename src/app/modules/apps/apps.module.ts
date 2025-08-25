import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { AppsRoutingModule } from './apps-routing.module';

@NgModule({
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    MatDialogModule,
    AppsRoutingModule,
    AngularSvgIconModule.forRoot(),

  ],
  declarations: [],
  providers: [provideHttpClient(withInterceptorsFromDi())],
})
export class AppsModule {}
