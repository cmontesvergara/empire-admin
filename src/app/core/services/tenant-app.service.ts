import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse, Application } from '../models';

@Injectable({
  providedIn: 'root',
})
export class TenantAppService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  /**
   * Obtener apps asociadas a un tenant
   */
  getTenantApps(
    tenantId: string,
  ): Observable<{ success: boolean; applications: Application[] }> {
    return this.http.get<{ success: boolean; applications: Application[] }>(
      `${this.baseUrl}/api/v1/tenant/${tenantId}/apps`,
      { withCredentials: true },
    );
  }

  /**
   * Asociar app a tenant
   */
  addAppToTenant(
    tenantId: string,
    applicationId: string,
  ): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(
      `${this.baseUrl}/api/v1/tenant/${tenantId}/apps`,
      { applicationId },
      { withCredentials: true },
    );
  }

  /**
   * Quitar app de tenant
   */
  removeAppFromTenant(
    tenantId: string,
    applicationId: string,
  ): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${this.baseUrl}/api/v1/tenant/${tenantId}/apps/${applicationId}`,
      { withCredentials: true },
    );
  }
}
