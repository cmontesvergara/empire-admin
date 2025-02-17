import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'src/app/core/services/loading/loading.service';
import { UserService } from 'src/app/core/services/user/user.service';
import { ProfileHeaderComponent } from '../../components/profile/profile-header/profile-header.component';
import { ProfilePersonalInformationComponent } from '../../components/profile/profile-personal-information/profile-personal-information.component';
import { ProfileSecurityComponent } from '../../components/profile/profile-security/profile-security.component';
import { UserBasicInformation } from '../../models/user-basic-information';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  standalone: true,
  imports: [
    ProfileHeaderComponent,
    ProfilePersonalInformationComponent,
    ProfileSecurityComponent,
    CommonModule
  ],
  providers: [UserService],
})
export class OverviewComponent implements OnInit {
  userBasicInformation: UserBasicInformation = <UserBasicInformation>{};

  constructor(private readonly userService: UserService,
    private loadingService:LoadingService
  ) {
    this.loadingService.update(true)
    this.userService.getUserInformation().subscribe((res: any) => {
      this.userBasicInformation = res.basic_information;
      this.loadingService.update(false);
    });
  }

  ngOnInit(): void {

  }
}
