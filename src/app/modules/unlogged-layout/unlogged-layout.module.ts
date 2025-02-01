import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { UnloggedLayoutRoutingModule } from './unlogged-layout-routing.module';
@NgModule({ imports: [UnloggedLayoutRoutingModule, AngularSvgIconModule.forRoot()], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class UnloggedLayoutModule {}
