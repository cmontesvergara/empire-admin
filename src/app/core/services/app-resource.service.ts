import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse, AppResource, RegisterAppResourcesDto } from '../models';

@Injectable({
  providedIn: 'root',
})
export class AppResourceService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  /**
   * Register or update resources for an application
   * This is typically called by applications during startup/deployment
   */
  registerAppResources(data: RegisterAppResourcesDto): Observable<
    ApiResponse<{
      applicationId: string;
      appId: string;
      resourcesRegistered: number;
    }>
  > {
    return this.http.post<
      ApiResponse<{
        applicationId: string;
        appId: string;
        resourcesRegistered: number;
      }>
    >(`${this.baseUrl}/api/v1/app-resources`, data, {
      withCredentials: true,
    });
  }

  /**
   * Get all resources for a specific application
   */
  getAppResources(appId: string): Observable<{
    success: boolean;
    resources: AppResource[];
    count: number;
  }> {
    return this.http.get<{
      success: boolean;
      resources: AppResource[];
      count: number;
    }>(`${this.baseUrl}/api/v1/app-resources/${appId}`, {
      withCredentials: true,
    });
  }

  /**
   * Get all available resources for a tenant
   * Returns resources from all apps enabled for the tenant
   */
  getAvailableResourcesForTenant(tenantId: string): Observable<{
    success: boolean;
    resources: AppResource[];
    count: number;
  }> {
    return this.http.get<{
      success: boolean;
      resources: AppResource[];
      count: number;
    }>(`${this.baseUrl}/api/v1/app-resources/tenant/${tenantId}/available`, {
      withCredentials: true,
    });
  }
}
