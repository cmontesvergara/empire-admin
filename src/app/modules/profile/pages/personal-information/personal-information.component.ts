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
import {
  AuthService,
  UserProfile,
} from 'src/app/core/services/auth/auth.service';
import { LoadingService } from 'src/app/core/services/loading/loading.service';
import { UtilService } from 'src/app/core/services/util/util.service';

@Component({
  selector: 'app-personal-information',
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class PersonalInformationComponent implements OnInit {
  userProfile: UserProfile | null = null;
  userForm!: FormGroup;
  genders = [{ value: '', label: 'No especificado' }];
  maritalStatuses = [{ value: '', label: 'No especificado' }];
  countries = [{ code: '', name: 'No especificado' }];

  // User data for form binding
  user = {
    nuid: '',
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
    mobile_phone: '',
    email: '',
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
    private readonly authService: AuthService,
    private readonly loadingService: LoadingService,
    private readonly router: Router,
  ) {
    this.loadingService.update(true);
    this.initForm();
  }

  async ngOnInit() {
    try {
      // Load dropdown data
      const [gendersResponse, countriesResponse, maritalStatusesResponse]: any =
        await Promise.all([
          firstValueFrom(this.utilService.getGenders()),
          firstValueFrom(this.utilService.getCountries()),
          firstValueFrom(this.utilService.getMaritalStatuses()),
        ]);

      this.genders = gendersResponse.genders;
      this.countries = countriesResponse.countries;
      this.maritalStatuses = maritalStatusesResponse.maritalStatuses;

      // Load user profile from backend
      const profileResponse: any = await firstValueFrom(
        this.authService.getProfile(),
      );

      if (profileResponse.success && profileResponse.user) {
        this.userProfile = profileResponse.user;

        // Map backend data to component user object
        const firstAddress = this.userProfile?.addresses?.[0];
        this.user = {
          nuid: this.userProfile?.nuid || '',
          first_name: this.userProfile?.firstName || '',
          second_name: this.userProfile?.secondName || '',
          last_name: this.userProfile?.lastName || '',
          second_last_name: this.userProfile?.secondLastName || '',
          birth_date: this.userProfile?.birthDate
            ? this.formatDateForInput(this.userProfile.birthDate)
            : '',
          mobile_phone: this.userProfile?.phone || '',
          email: this.userProfile?.email || '',
          gender: this.userProfile?.gender || '',
          nationality: this.userProfile?.nationality || '',
          marital_status: this.userProfile?.maritalStatus || '',
          occupation: this.userProfile?.occupation || '',
          place_of_birth: this.userProfile?.birthPlace || '',
          place_of_residence: this.userProfile?.placeOfResidence || '',
          user_status: this.userProfile?.userStatus || '',
          addresses: firstAddress
            ? [
                {
                  street: firstAddress.detail || '',
                  city: firstAddress.city || '',
                  state: firstAddress.province || '',
                  country: firstAddress.country || '',
                },
              ]
            : [
                {
                  street: '',
                  city: '',
                  state: '',
                  country: '',
                },
              ],
        };

        // Reinitialize form with loaded data
        this.initForm();
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      this.loadingService.update(false);
    }
  }

  formatDateForInput(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
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
      const formValues = this.userForm.value;

      // Prepare data for backend
      const profileData = {
        firstName: formValues.first_name,
        secondName: formValues.second_name,
        lastName: formValues.last_name,
        secondLastName: formValues.second_last_name,
        phone: formValues.mobile_phone,
        birthDate: formValues.birth_date,
        gender: formValues.gender,
        nationality: formValues.nationality,
        birthPlace: formValues.place_of_birth,
        placeOfResidence: formValues.place_of_residence,
        occupation: formValues.occupation,
        maritalStatus: formValues.marital_status,
        addresses: [
          {
            country: formValues.addresses.country,
            state: formValues.addresses.state,
            city: formValues.addresses.city,
            street: formValues.addresses.street,
          },
        ],
      };

      this.loadingService.update(true);
      this.authService.updateProfile(profileData as any).subscribe({
        next: (response) => {
          console.log('Profile updated successfully:', response);
          alert('Perfil actualizado exitosamente');
          this.router.navigateByUrl('dashboard/profile');
        },
        error: (error) => {
          console.error('Error updating profile:', error);
          alert('Error al actualizar el perfil');
          this.loadingService.update(false);
        },
        complete: () => {
          this.loadingService.update(false);
        },
      });
    }
  }

  cancelEdit(): void {
    this.userForm.reset(this.user);
    this.router.navigateByUrl('dashboard/profile');
  }
}
