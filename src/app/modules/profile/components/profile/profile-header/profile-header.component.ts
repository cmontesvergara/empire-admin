import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AvatarModule } from 'ngx-avatars';

import { UserBasicInformation } from '../../../models/user-basic-information';

@Component({
  selector: 'app-profile-header',
  templateUrl: './profile-header.component.html',
  standalone: true,
  providers: [],
  imports: [TitleCasePipe, CommonModule, AvatarModule],
})
export class ProfileHeaderComponent {
  @Input() user: UserBasicInformation = <UserBasicInformation>{};
  constructor() {

  }


}
