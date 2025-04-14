import { NgModule } from '@angular/core';

import { UserService } from 'src/app/core/services/user/user.service';
import { UtilService } from 'src/app/core/services/util/util.service';
import { ProfileRoutingModule } from './profile-routing.module';

@NgModule({
  imports: [ProfileRoutingModule],
  providers: [UtilService,UserService],
})
export class ProfileModule {}
