import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
    ApiResponse,
    CreateTenantDto,
    InviteTenantMemberDto,
    Tenant,
    TenantMember,
    UpdateMemberRoleDto,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class TenantManagementService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  /**
   * Get all tenants for current user
   * System admins see all, regular users see only their tenants
   */
  getAllTenants(): Observable<{
    success: boolean;
    tenants: Tenant[];
    count: number;
  }> {
    return this.http.get<{
      success: boolean;
      tenants: Tenant[];
      count: number;
    }>(`${this.baseUrl}/api/v1/tenant`, { withCredentials: true });
  }

  /**
   * Get single tenant by ID
   */
  getTenant(
    tenantId: string,
  ): Observable<{ success: boolean; tenant: Tenant }> {
    return this.http.get<{ success: boolean; tenant: Tenant }>(
      `${this.baseUrl}/api/v1/tenant/${tenantId}`,
      { withCredentials: true },
    );
  }

  /**
   * Create new tenant (system admin only)
   * Requires existing active user as tenant admin
   */
  createTenant(data: CreateTenantDto): Observable<ApiResponse<Tenant>> {
    return this.http.post<ApiResponse<Tenant>>(
      `${this.baseUrl}/api/v1/tenant`,
      data,
      { withCredentials: true },
    );
  }

  /**
   * Update tenant (tenant admin only)
   */
  updateTenant(
    tenantId: string,
    data: { displayName?: string },
  ): Observable<ApiResponse<Tenant>> {
    return this.http.put<ApiResponse<Tenant>>(
      `${this.baseUrl}/api/v1/tenant/${tenantId}`,
      data,
      { withCredentials: true },
    );
  }

  /**
   * Get all members of a tenant
   */
  getTenantMembers(tenantId: string): Observable<{
    success: boolean;
    members: TenantMember[];
    count: number;
  }> {
    return this.http.get<{
      success: boolean;
      members: TenantMember[];
      count: number;
    }>(`${this.baseUrl}/api/v1/tenant/${tenantId}/members`, {
      withCredentials: true,
    });
  }

  /**
   * Invite user to tenant (tenant admin only)
   * Creates user if doesn't exist
   */
  inviteMember(
    tenantId: string,
    data: InviteTenantMemberDto,
  ): Observable<ApiResponse<TenantMember>> {
    return this.http.post<ApiResponse<TenantMember>>(
      `${this.baseUrl}/api/v1/tenant/${tenantId}/members`,
      data,
      { withCredentials: true },
    );
  }

  /**
   * Update member role (tenant admin only)
   */
  updateMemberRole(
    tenantId: string,
    memberId: string,
    data: UpdateMemberRoleDto,
  ): Observable<ApiResponse<TenantMember>> {
    return this.http.put<ApiResponse<TenantMember>>(
      `${this.baseUrl}/api/v1/tenant/${tenantId}/members/${memberId}`,
      data,
      { withCredentials: true },
    );
  }

  /**
   * Remove member from tenant (tenant admin only)
   */
  removeMember(
    tenantId: string,
    memberId: string,
  ): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${this.baseUrl}/api/v1/tenant/${tenantId}/members/${memberId}`,
      { withCredentials: true },
    );
  }
}
