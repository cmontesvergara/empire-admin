import { NgModule } from '@angular/core';

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { AppsRoutingModule } from './apps-routing.module';

@NgModule({
    imports: [AppsRoutingModule, AngularSvgIconModule.forRoot()],
    providers: [provideHttpClient(withInterceptorsFromDi())]
})
export class AppsModule {}
