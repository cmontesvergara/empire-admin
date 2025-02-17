import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toast } from 'ngx-sonner';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SessionStorageService } from '../services/session-storage/session-storage.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly sessionStorageService: SessionStorageService,
  ) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse | any) => {
        let errorMessage = 'Ocurrió un error inesperado';

        if (error.error instanceof ErrorEvent) {
          // Error del lado del cliente
          errorMessage = `Front Error: ${error.error.message}`;
        } else {
          // Error del lado del servidor
          errorMessage = `Back Error ${error.status}: ${error.message}`;
          if (
            error.error.resultCode === 'UNAUTHORIZED' &&
            error.error.message.includes('jwt expired')
          ) {
            toast.error('Sesion Expirada.', {
              position: 'bottom-right',
              description: 'Vuelva a inciar sesion.',
            });
              const url = this.router.url
              this.sessionStorageService.saveLastUrl(url)
              this.sessionStorageService.removeAccessToken()
              this.router.navigateByUrl('auth/sign-in');
          }
          if (
            error.error.resultCode === 'DEFAULT_ERROR'
          ) {
            toast.error('Houston, tenemos problemas.', {
              position: 'bottom-right',
              description: 'Ocurrio un error, intente mas tarde.',
              action: {
                label: 'Ir al inicio',
                onClick: () => this.router.navigate(['/']),
              },
              actionButtonStyle: 'background-color:#000000; color:white;',
            });
          }
        }

        console.error(errorMessage);
        return throwError(() => new Error(errorMessage));
      }),
    );
  }
}
