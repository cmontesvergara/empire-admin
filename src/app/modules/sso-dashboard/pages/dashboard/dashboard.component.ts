import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AuthService,
  TenantWithApps,
  UserProfile,
} from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  user: UserProfile | null = null;
  tenants: TenantWithApps[] = [];
  loading = true;
  error: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  async ngOnInit() {
    try {
      await this.loadUserData();
      await this.loadTenants();
    } catch (error: any) {
      this.error = error.message || 'Error al cargar datos';
    } finally {
      this.loading = false;
    }
  }

  async loadUserData() {
    this.authService.getProfile().subscribe({
      next: (profile) => {
        this.user = profile;
      },
      error: (err) => {
        console.error('Error loading profile:', err);
        throw err;
      },
    });
  }

  async loadTenants() {
    this.authService.getUserTenants().subscribe({
      next: (response) => {
        this.tenants = response.tenants;
      },
      error: (err) => {
        console.error('Error loading tenants:', err);
        throw err;
      },
    });
  }

  async launchApp(tenantId: string, appId: string, appUrl: string) {
    try {
      const redirectUri = `${appUrl}/auth/callback`;

      this.authService.authorize(tenantId, appId, redirectUri).subscribe({
        next: (response) => {
          // Redirect to app with auth code
          window.location.href = response.redirectUri;
        },
        error: (err) => {
          console.error('Error launching app:', err);
          alert('Error al lanzar aplicación');
        },
      });
    } catch (error) {
      console.error('Error:', error);
      alert('Error al lanzar aplicación');
    }
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  goToSecurity() {
    this.router.navigate(['/security']);
  }
}
