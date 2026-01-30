import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
    SystemRole,
    Tenant,
    TenantMember,
    TenantRole,
    UserProfile,
} from 'src/app/core/models';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { TenantManagementService } from 'src/app/core/services/tenant-management.service';

@Component({
  selector: 'app-tenants',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './tenants.component.html',
  styleUrl: './tenants.component.scss',
})
export class TenantsComponent implements OnInit {
  tenants: Tenant[] = [];
  selectedTenant: Tenant | null = null;
  tenantMembers: TenantMember[] = [];
  loading = true;
  loadingMembers = false;
  error: string | null = null;
  success: string | null = null;
  user: UserProfile | null = null;

  // Modal states
  showCreateModal = false;
  showMemberModal = false;
  showInviteModal = false;
  showRoleModal = false;
  showDeleteModal = false;
  selectedMember: TenantMember | null = null;

  // Form data
  createForm = {
    name: '',
    slug: '',
    tenantAdminEmail: '',
  };

  inviteForm = {
    email: '',
    role: TenantRole.MEMBER,
  };

  roleForm = {
    role: TenantRole.MEMBER,
  };

  // Enums for template
  TenantRole = TenantRole;
  SystemRole = SystemRole;

  constructor(
    private tenantService: TenantManagementService,
    private authService: AuthService,
    private router: Router,
  ) {}

  async ngOnInit() {
    await this.loadUserProfile();
    await this.loadTenants();
  }

  async loadUserProfile() {
    this.authService.getProfile().subscribe({
      next: (response) => {
        this.user = response.user;

        // Check if user has access
        if (!this.canViewTenants()) {
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

  async loadTenants() {
    this.loading = true;
    this.error = null;
    this.tenantService.getAllTenants().subscribe({
      next: (response) => {
        this.tenants = response.tenants;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading tenants:', err);
        this.error = err.error?.message || 'Error al cargar tenants';
        this.loading = false;
      },
    });
  }

  async loadTenantMembers(tenantId: string) {
    this.loadingMembers = true;
    this.tenantService.getTenantMembers(tenantId).subscribe({
      next: (response) => {
        this.tenantMembers = response.members;
        this.loadingMembers = false;
      },
      error: (err) => {
        console.error('Error loading members:', err);
        this.error = err.error?.message || 'Error al cargar miembros';
        this.loadingMembers = false;
      },
    });
  }

  // Permission checks
  canViewTenants(): boolean {
    return this.user !== null;
  }

  canCreateTenant(): boolean {
    return (
      this.user?.systemRole === SystemRole.SYSTEM_ADMIN ||
      this.user?.systemRole === SystemRole.SUPER_ADMIN
    );
  }

  canManageTenant(tenant: Tenant): boolean {
    return tenant.role === TenantRole.ADMIN;
  }

  // Modal controls
  openCreateModal() {
    this.createForm = {
      name: '',
      slug: '',
      tenantAdminEmail: '',
    };
    this.showCreateModal = true;
    this.error = null;
    this.success = null;
  }

  closeCreateModal() {
    this.showCreateModal = false;
  }

  openMemberModal(tenant: Tenant) {
    this.selectedTenant = tenant;
    this.showMemberModal = true;
    this.loadTenantMembers(tenant.id);
  }

  closeMemberModal() {
    this.showMemberModal = false;
    this.selectedTenant = null;
    this.tenantMembers = [];
  }

  openInviteModal() {
    this.inviteForm = {
      email: '',
      role: TenantRole.MEMBER,
    };
    this.showInviteModal = true;
    this.error = null;
    this.success = null;
  }

  closeInviteModal() {
    this.showInviteModal = false;
  }

  openRoleModal(member: TenantMember) {
    this.selectedMember = member;
    this.roleForm = {
      role: member.role,
    };
    this.showRoleModal = true;
    this.error = null;
    this.success = null;
  }

  closeRoleModal() {
    this.showRoleModal = false;
    this.selectedMember = null;
  }

  openDeleteModal(member: TenantMember) {
    this.selectedMember = member;
    this.showDeleteModal = true;
    this.error = null;
    this.success = null;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.selectedMember = null;
  }

  // CRUD operations
  async createTenant() {
    if (!this.createForm.name || !this.createForm.tenantAdminEmail) {
      this.error = 'Por favor complete todos los campos requeridos';
      return;
    }

    this.loading = true;
    this.error = null;

    this.tenantService.createTenant(this.createForm).subscribe({
      next: (response) => {
        this.success = 'Tenant creado exitosamente';
        this.closeCreateModal();
        this.loadTenants();
      },
      error: (err) => {
        console.error('Error creating tenant:', err);
        this.error = err.error?.message || 'Error al crear tenant';
        this.loading = false;
      },
    });
  }

  async inviteMember() {
    if (!this.selectedTenant || !this.inviteForm.email) {
      this.error = 'Por favor complete todos los campos';
      return;
    }

    this.loadingMembers = true;
    this.error = null;

    this.tenantService
      .inviteMember(this.selectedTenant.id, this.inviteForm)
      .subscribe({
        next: (response) => {
          this.success = 'Usuario invitado exitosamente';
          this.closeInviteModal();
          this.loadTenantMembers(this.selectedTenant!.id);
        },
        error: (err) => {
          console.error('Error inviting member:', err);
          this.error = err.error?.message || 'Error al invitar usuario';
          this.loadingMembers = false;
        },
      });
  }

  async updateMemberRole() {
    if (!this.selectedTenant || !this.selectedMember) {
      return;
    }

    this.loadingMembers = true;
    this.error = null;

    this.tenantService
      .updateMemberRole(
        this.selectedTenant.id,
        this.selectedMember.userId,
        this.roleForm,
      )
      .subscribe({
        next: (response) => {
          this.success = 'Rol actualizado exitosamente';
          this.closeRoleModal();
          this.loadTenantMembers(this.selectedTenant!.id);
        },
        error: (err) => {
          console.error('Error updating role:', err);
          this.error = err.error?.message || 'Error al actualizar rol';
          this.loadingMembers = false;
        },
      });
  }

  async removeMember() {
    if (!this.selectedTenant || !this.selectedMember) {
      return;
    }

    this.loadingMembers = true;
    this.error = null;

    this.tenantService
      .removeMember(this.selectedTenant.id, this.selectedMember.userId)
      .subscribe({
        next: (response) => {
          this.success = 'Miembro eliminado exitosamente';
          this.closeDeleteModal();
          this.loadTenantMembers(this.selectedTenant!.id);
        },
        error: (err) => {
          console.error('Error removing member:', err);
          this.error = err.error?.message || 'Error al eliminar miembro';
          this.loadingMembers = false;
        },
      });
  }

  getRoleBadgeClass(role: TenantRole): string {
    switch (role) {
      case TenantRole.ADMIN:
        return 'badge-admin';
      case TenantRole.MEMBER:
        return 'badge-member';
      case TenantRole.VIEWER:
        return 'badge-viewer';
      default:
        return '';
    }
  }

  getRoleLabel(role: TenantRole): string {
    switch (role) {
      case TenantRole.ADMIN:
        return 'Admin';
      case TenantRole.MEMBER:
        return 'Miembro';
      case TenantRole.VIEWER:
        return 'Visor';
      default:
        return role;
    }
  }
}
