import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { UserService } from 'src/app/core/services/user/user.service';
import { LoggedLayoutRoutingModule } from './logged-layout-routing.module';
@NgModule({
  imports: [LoggedLayoutRoutingModule, AngularSvgIconModule.forRoot()],
  providers: [provideHttpClient(withInterceptorsFromDi()), UserService],
})
export class LoggedLayoutModule {}
