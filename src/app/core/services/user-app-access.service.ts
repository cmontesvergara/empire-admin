import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../models';

export interface UserAppAccess {
    id: string;
    userId: string;
    tenantId: string;
    applicationId: string;
    grantedAt: string;
    grantedBy: string | null;
}

export interface UserAppAccessWithApplication extends UserAppAccess {
    application: {
        id: string;
        appId: string;
        name: string;
        url: string;
        description: string | null;
        logoUrl: string | null;
        isActive: boolean;
    };
}

@Injectable({
    providedIn: 'root',
})
export class UserAppAccessService {
    private baseUrl = environment.baseUrl;

    constructor(private http: HttpClient) { }

    /**
     * Grant app access to a user
     * POST /api/v1/applications/tenant/:tenantId/:applicationId/grant
     */
    grantAppAccess(
        tenantId: string,
        applicationId: string,
        userId: string
    ): Observable<ApiResponse<UserAppAccess>> {
        return this.http.post<ApiResponse<UserAppAccess>>(
            `${this.baseUrl}/api/v1/applications/tenant/${tenantId}/${applicationId}/grant`,
            { userId },
            { withCredentials: true }
        );
    }

    /**
     * Grant app access to multiple users
     * POST /api/v1/applications/tenant/:tenantId/:applicationId/grant-bulk
     */
    grantBulkAppAccess(
        tenantId: string,
        applicationId: string,
        userIds: string[]
    ): Observable<ApiResponse<{ count: number; message: string }>> {
        return this.http.post<ApiResponse<{ count: number; message: string }>>(
            `${this.baseUrl}/api/v1/applications/tenant/${tenantId}/${applicationId}/grant-bulk`,
            { userIds },
            { withCredentials: true }
        );
    }

    /**
     * Revoke app access from a user
     * DELETE /api/v1/applications/tenant/:tenantId/:applicationId/revoke/:userId
     */
    revokeAppAccess(
        tenantId: string,
        applicationId: string,
        userId: string
    ): Observable<ApiResponse<void>> {
        return this.http.delete<ApiResponse<void>>(
            `${this.baseUrl}/api/v1/applications/tenant/${tenantId}/${applicationId}/revoke/${userId}`,
            { withCredentials: true }
        );
    }

    /**
     * List users with access to an app
     * GET /api/v1/applications/tenant/:tenantId/:applicationId/users
     */
    getUsersWithAppAccess(
        tenantId: string,
        applicationId: string
    ): Observable<{ success: boolean; users: UserAppAccess[] }> {
        return this.http.get<{ success: boolean; users: UserAppAccess[] }>(
            `${this.baseUrl}/api/v1/applications/tenant/${tenantId}/${applicationId}/users`,
            { withCredentials: true }
        );
    }

    /**
     * List apps the authenticated user has access to in a tenant
     * GET /api/v1/applications/user/:tenantId
     */
    getUserAppsInTenant(
        tenantId: string
    ): Observable<{
        success: boolean;
        applications: UserAppAccessWithApplication[];
    }> {
        return this.http.get<{
            success: boolean;
            applications: UserAppAccessWithApplication[];
        }>(`${this.baseUrl}/api/v1/applications/user/${tenantId}`, {
            withCredentials: true,
        });
    }
}
