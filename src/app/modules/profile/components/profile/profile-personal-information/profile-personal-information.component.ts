import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { UserBasicInformation } from '../../../models/user-basic-information';

@Component({
  selector: 'app-profile-personal-information',
  templateUrl: './profile-personal-information.component.html',
  standalone: true,
  imports:[TitleCasePipe,CommonModule],
  styleUrl: './profile-personal-information.component.scss',
})
export class ProfilePersonalInformationComponent implements OnInit {
  @Input() user: UserBasicInformation = <UserBasicInformation>{};

  constructor() {}

  ngOnInit(): void {}
}
