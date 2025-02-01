import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { LoggedLayoutRoutingModule } from './logged-layout-routing.module';
@NgModule({ imports: [LoggedLayoutRoutingModule, AngularSvgIconModule.forRoot()], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class LoggedLayoutModule {}
