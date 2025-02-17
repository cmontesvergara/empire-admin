import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AvatarModule } from 'ngx-avatars';
import { UserService } from 'src/app/core/services/user/user.service';
import { UserBasicInformation } from '../../../models/user-basic-information';

@Component({
  selector: 'app-profile-header',
  templateUrl: './profile-header.component.html',
  standalone: true,
  providers: [UserService],
  imports: [TitleCasePipe, CommonModule, AvatarModule],
})
export class ProfileHeaderComponent {
  @Input() user: UserBasicInformation = <UserBasicInformation>{};
  constructor() {

  }


}
