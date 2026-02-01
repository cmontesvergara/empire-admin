import { NgModule } from '@angular/core';


import { UtilService } from 'src/app/core/services/util/util.service';
import { ProfileRoutingModule } from './profile-routing.module';

@NgModule({
  imports: [ProfileRoutingModule],
  providers: [UtilService],
})
export class ProfileModule { }
