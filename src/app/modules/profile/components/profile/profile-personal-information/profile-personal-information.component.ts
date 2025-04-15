import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UserBasicInformation } from '../../../models/user-basic-information';

@Component({
  selector: 'app-profile-personal-information',
  templateUrl: './profile-personal-information.component.html',
  standalone: true,
  imports: [TitleCasePipe, CommonModule],
  styleUrl: './profile-personal-information.component.scss',
})
export class ProfilePersonalInformationComponent  {
  @Input() user: UserBasicInformation = <UserBasicInformation>{};

  constructor(
    private readonly router: Router,
  ) {}


  callToAction() {
    this.router.navigate(['/dashboard/profile/personal-information']);
  }
}
