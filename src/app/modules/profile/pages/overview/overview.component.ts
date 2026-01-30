import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AuthService,
  TenantWithApps,
} from 'src/app/core/services/auth/auth.service';
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
    CommonModule,
  ],
  providers: [UserService],
})
export class OverviewComponent implements OnInit {
  userBasicInformation: UserBasicInformation = <UserBasicInformation>{};
  tenants: TenantWithApps[] = [];
  totalApps = 0;
  loadingTenants = true;

  constructor(
    private readonly userService: UserService,
    private loadingService: LoadingService,
    private authService: AuthService,
    private router: Router,
  ) {
    this.loadingService.update(true);
  }

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadTenants();
  }

  loadUserProfile() {
    this.authService.getProfile().subscribe({
      next: (response) => {
        if (response.success && response.user) {
          const user = response.user;
          const firstAddress = user.addresses?.[0];

          this.userBasicInformation = {
            first_name: user.firstName,
            second_name: user.secondName || '',
            last_name: user.lastName,
            second_last_name: user.secondLastName || '',
            occupation: user.occupation || '',
            nationality: user.nationality || '',
            place_of_residence: user.placeOfResidence || '',
            place_of_birth: user.birthPlace || '',
            marital_status: user.maritalStatus || '',
            gender: user.gender || '',
            birth_date: user.birthDate || '',
            phone: user.phone,
            email: user.email,
            nit: user.nuid,
            user_status:
              user.userStatus === 'active' ? 'verified' : 'unverified',
            addresses: firstAddress
              ? [
                  {
                    street: firstAddress.detail || '',
                    country: firstAddress.country || '',
                    state: firstAddress.province || '',
                    city: firstAddress.city || '',
                  },
                ]
              : [],
          };
        }
        this.loadingService.update(false);
      },
      error: (err) => {
        console.error('Error loading profile:', err);
        this.loadingService.update(false);
      },
    });
  }

  loadTenants() {
    this.authService.getUserTenants().subscribe({
      next: (response) => {
        this.tenants = response.tenants;
        this.totalApps = this.tenants.reduce(
          (acc, tenant) => acc + tenant.apps.length,
          0,
        );
        this.loadingTenants = false;
      },
      error: (err) => {
        console.error('Error loading tenants:', err);
        this.loadingTenants = false;
      },
    });
  }

  launchApp(tenantId: string, appId: string, appUrl: string) {
    const redirectUri = `${appUrl}/auth/callback`;
    this.authService.authorize(tenantId, appId, redirectUri).subscribe({
      next: (response) => {
        window.location.href = response.redirectUri;
      },
      error: (err) => {
        console.error('Error launching app:', err);
        alert('Error al lanzar aplicación');
      },
    });
  }

  viewAllApps() {
    this.router.navigate(['/sso-dashboard']);
  }
}
