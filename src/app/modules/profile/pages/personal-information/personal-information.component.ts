// personal-info.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { LoadingService } from 'src/app/core/services/loading/loading.service';
import { UserService } from 'src/app/core/services/user/user.service';
import { UtilService } from 'src/app/core/services/util/util.service';
import { UserBasicInformation } from '../../models/user-basic-information';

@Component({
  selector: 'app-personal-information',
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class PersonalInformationComponent implements OnInit {
  userBasicInformation: UserBasicInformation = <UserBasicInformation>{};
  userForm!: FormGroup;
  genders = [{ value: '', label: 'No especificado' }];
  maritalStatuses = [{ value: '', label: 'No especificado' }];
  countries = [{ code: '', name: 'No especificado' }];

  // Mock data
  user = {
    nit: '',
    first_name: '',
    second_name: '',
    last_name: '',
    second_last_name: '',
    birth_date: '',
    addresses: [
      {
        street: '',
        city: '',
        state: '',
        country: '',
      },
    ],
    phone_landline: '',
    mobile_phone: '',
    email: '',
    social_media: '',
    gender: '',
    nationality: '',
    marital_status: '',
    occupation: '',
    place_of_birth: '',
    user_status: '',
    place_of_residence: '',
  };

  constructor(
    private readonly fb: FormBuilder,
    private readonly utilService: UtilService,
    private readonly userService: UserService,
    private readonly loadingService: LoadingService,
    private readonly router: Router,
  ) {
    this.loadingService.update(true);
    this.initForm();
  }

  async ngOnInit() {
    const gendersResponse: any = await firstValueFrom(
      this.utilService.getGenders(),
    );
    this.genders = gendersResponse.genders;
    const countriesResponse: any = await firstValueFrom(
      this.utilService.getCountries(),
    );
    this.countries = countriesResponse.countries;
    const maritalStatusesResponse: any = await firstValueFrom(
      this.utilService.getMaritalStatuses(),
    );
    this.maritalStatuses = maritalStatusesResponse.maritalStatuses;

    this.userService.getUserInformation().subscribe((data: any) => {
      this.userBasicInformation = data.basic_information;
      this.user = {
        ...this.user,
        nit: this.userBasicInformation.nit,
        first_name: this.userBasicInformation.first_name,
        second_name: this.userBasicInformation.second_name || '',
        last_name: this.userBasicInformation.last_name,
        second_last_name: this.userBasicInformation.second_last_name || '',
        nationality: this.userBasicInformation.nationality || '',
        mobile_phone: this.userBasicInformation.phone,
        email: this.userBasicInformation.email,
        user_status: this.userBasicInformation.user_status,
        addresses: this.userBasicInformation.addresses || [],
        place_of_residence: this.userBasicInformation.place_of_residence || '',
        place_of_birth: this.userBasicInformation.place_of_birth || '',
        marital_status: this.userBasicInformation.marital_status || '',
        gender: this.userBasicInformation.gender || '',
        occupation: this.userBasicInformation.occupation || '',
        birth_date: this.userBasicInformation.birth_date || '',
      };
      this.initForm();
      this.loadingService.update(false);
    });
  }

  initForm(): void {
    this.userForm = this.fb.group({
      first_name: [this.user.first_name, Validators.required],
      second_name: [this.user.second_name],
      last_name: [this.user.last_name, Validators.required],
      second_last_name: [this.user.second_last_name],
      birth_date: [this.user.birth_date, Validators.required],
      addresses: this.fb.group({
        street: [this.user.addresses[0]?.street || null],
        city: [this.user.addresses[0]?.city || null],
        state: [this.user.addresses[0]?.state || null],
        country: [this.user.addresses[0]?.country || null],
      }),
      mobile_phone: [
        this.user.mobile_phone,
        [
          Validators.required,
          Validators.pattern(/^3[0-9]{2}[0-9]{3}[0-9]{4}$/),
        ],
      ],
      email: [this.user.email, [Validators.required, Validators.email]],
      gender: [this.user.gender, Validators.required],
      nationality: [this.user.nationality, Validators.required],
      marital_status: [this.user.marital_status],
      occupation: [this.user.occupation],
      place_of_birth: [this.user.place_of_birth],
      user_status: [this.user.user_status, Validators.required],
      place_of_residence: [this.user.place_of_residence],
    });
  }

  saveChanges(): void {
    if (this.userForm.valid) {
      this.user = {
        ...this.user,
        ...this.userForm.value,
        addresses: [this.userForm.value.addresses],
      };
      this.userService
        .updateUserInformation(this.user)
        .subscribe((response) => {
          console.log('Datos actualizados:', response);
          location.reload()
        });
    }
  }

  cancelEdit(): void {
    this.userForm.reset(this.user);
    this.router.navigateByUrl('dashboard/profile');
  }
}
