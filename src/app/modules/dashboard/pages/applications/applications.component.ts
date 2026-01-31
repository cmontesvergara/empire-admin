import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Application, SystemRole, UserProfile } from 'src/app/core/models';
import { ApplicationManagementService } from 'src/app/core/services/application-management.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './applications.component.html',
  styleUrl: './applications.component.scss',
})
export class ApplicationsComponent implements OnInit {
  applications: Application[] = [];
  loading = true;
  error: string | null = null;
  user: UserProfile | null = null;

  // Form state
  showCreateModal = false;
  showEditModal = false;
  showDeleteModal = false;
  selectedApp: Application | null = null;

  formData = {
    appId: '',
    name: '',
    url: '',
    description: '',
    logoUrl: '',
    isActive: true,
  };

  constructor(
    private appManagementService: ApplicationManagementService,
    private authService: AuthService,
    private router: Router,
  ) {}

  async ngOnInit() {
    await this.loadUserProfile();
    await this.loadApplications();
  }

  async loadUserProfile() {
    this.authService.getProfile().subscribe({
      next: (response) => {
        this.user = response.user;

        // Check if user has admin permissions
        if (!this.canManageApps()) {
          this.error = 'No tienes permisos para acceder a esta página';
          setTimeout(() => this.router.navigate(['/dashboard']), 2000);
        }
      },
      error: (err) => {
        console.error('Error loading profile:', err);
        this.error = 'Error al cargar perfil de usuario';
      },
    });
  }

  async loadApplications() {
    this.loading = true;
    this.appManagementService.getAllApplications().subscribe({
      next: (response) => {
        this.applications = response.applications;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading applications:', err);
        this.error = 'Error al cargar aplicaciones';
        this.loading = false;
      },
    });
  }

  canManageApps(): boolean {
    return (
      this.user?.systemRole === SystemRole.SYSTEM_ADMIN ||
      this.user?.systemRole === SystemRole.SUPER_ADMIN
    );
  }

  canDeleteApps(): boolean {
    return this.user?.systemRole === SystemRole.SUPER_ADMIN;
  }

  openCreateModal() {
    this.formData = {
      appId: '',
      name: '',
      url: '',
      description: '',
      logoUrl: '',
      isActive: true,
    };
    this.showCreateModal = true;
  }

  openEditModal(app: Application) {
    this.selectedApp = app;
    this.formData = {
      appId: app.appId,
      name: app.name,
      url: app.url,
      description: app.description || '',
      logoUrl: app.logoUrl || '',
      isActive: app.isActive,
    };
    this.showEditModal = true;
  }

  openDeleteModal(app: Application) {
    this.selectedApp = app;
    this.showDeleteModal = true;
  }

  closeModals() {
    this.showCreateModal = false;
    this.showEditModal = false;
    this.showDeleteModal = false;
    this.selectedApp = null;
  }

  createApplication() {
    this.appManagementService.createApplication(this.formData).subscribe({
      next: () => {
        this.closeModals();
        this.loadApplications();
      },
      error: (err) => {
        console.error('Error creating application:', err);
        alert(
          'Error al crear aplicación: ' +
            (err.error?.message || 'Error desconocido'),
        );
      },
    });
  }

  updateApplication() {
    if (!this.selectedApp) return;

    const { appId, ...updateData } = this.formData;

    this.appManagementService
      .updateApplication(this.selectedApp.id, updateData)
      .subscribe({
        next: () => {
          this.closeModals();
          this.loadApplications();
        },
        error: (err) => {
          console.error('Error updating application:', err);
          alert(
            'Error al actualizar aplicación: ' +
              (err.error?.message || 'Error desconocido'),
          );
        },
      });
  }

  deleteApplication() {
    if (!this.selectedApp) return;

    this.appManagementService.deleteApplication(this.selectedApp.id).subscribe({
      next: () => {
        this.closeModals();
        this.loadApplications();
      },
      error: (err) => {
        console.error('Error deleting application:', err);
        alert(
          'Error al eliminar aplicación: ' +
            (err.error?.message || 'Error desconocido'),
        );
      },
    });
  }

  toggleAppStatus(app: Application) {
    this.appManagementService
      .updateApplication(app.id, { isActive: !app.isActive })
      .subscribe({
        next: () => {
          this.loadApplications();
        },
        error: (err) => {
          console.error('Error toggling app status:', err);
          alert('Error al cambiar estado');
        },
      });
  }
}
