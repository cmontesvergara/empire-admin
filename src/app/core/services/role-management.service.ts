import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
    ApiResponse,
    CreatePermissionDto,
    CreateRoleDto,
    CustomRole,
    Permission,
    UpdateRoleDto,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class RoleManagementService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  /**
   * Create a custom role (tenant admin only)
   */
  createRole(data: CreateRoleDto): Observable<ApiResponse<CustomRole>> {
    return this.http.post<ApiResponse<CustomRole>>(
      `${this.baseUrl}/api/v1/role`,
      data,
      { withCredentials: true },
    );
  }

  /**
   * Get all roles for a tenant
   */
  getTenantRoles(tenantId: string): Observable<{
    success: boolean;
    roles: CustomRole[];
    count: number;
  }> {
    return this.http.get<{
      success: boolean;
      roles: CustomRole[];
      count: number;
    }>(`${this.baseUrl}/api/v1/role/tenant/${tenantId}`, {
      withCredentials: true,
    });
  }

  /**
   * Get role details with permissions
   */
  getRole(roleId: string): Observable<{
    success: boolean;
    role: CustomRole;
  }> {
    return this.http.get<{
      success: boolean;
      role: CustomRole;
    }>(`${this.baseUrl}/api/v1/role/${roleId}`, {
      withCredentials: true,
    });
  }

  /**
   * Update role (tenant admin only)
   */
  updateRole(
    roleId: string,
    data: UpdateRoleDto,
  ): Observable<ApiResponse<CustomRole>> {
    return this.http.put<ApiResponse<CustomRole>>(
      `${this.baseUrl}/api/v1/role/${roleId}`,
      data,
      { withCredentials: true },
    );
  }

  /**
   * Delete role (tenant admin only)
   */
  deleteRole(roleId: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${this.baseUrl}/api/v1/role/${roleId}`,
      { withCredentials: true },
    );
  }

  /**
   * Add permission to role (tenant admin only)
   */
  addPermission(
    roleId: string,
    data: CreatePermissionDto,
  ): Observable<ApiResponse<Permission>> {
    return this.http.post<ApiResponse<Permission>>(
      `${this.baseUrl}/api/v1/role/${roleId}/permission`,
      data,
      { withCredentials: true },
    );
  }

  /**
   * Get all permissions for a role
   */
  getRolePermissions(roleId: string): Observable<{
    success: boolean;
    permissions: Permission[];
    count: number;
  }> {
    return this.http.get<{
      success: boolean;
      permissions: Permission[];
      count: number;
    }>(`${this.baseUrl}/api/v1/role/${roleId}/permission`, {
      withCredentials: true,
    });
  }

  /**
   * Remove permission from role (tenant admin only)
   */
  removePermission(
    roleId: string,
    permissionId: string,
  ): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${this.baseUrl}/api/v1/role/${roleId}/permission/${permissionId}`,
      { withCredentials: true },
    );
  }

  /**
   * Remove permission by resource and action (tenant admin only)
   */
  removePermissionByResourceAction(
    roleId: string,
    applicationId: string,
    resource: string,
    action: string,
  ): Observable<ApiResponse<void>> {
    return this.http.request<ApiResponse<void>>(
      'DELETE',
      `${this.baseUrl}/api/v1/role/${roleId}/permission`,
      {
        body: { applicationId, resource, action },
        withCredentials: true,
      },
    );
  }
}
