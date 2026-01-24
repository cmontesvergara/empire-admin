import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';

@Component({
  selector: 'app-email-verification-validate',
  templateUrl: './email-verification-validate.component.html',
  styleUrls: ['./email-verification-validate.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent],
  providers: [AuthService],
})
export class EmailVerificationValidateComponent implements OnInit {
  isLoading: boolean = true;
  isSuccess: boolean = false;
  errorMessage: string = '';
  countdown: number = 10;
  private countdownInterval: any;

  constructor(
    private readonly authService: AuthService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    // Get token from query params
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        this.verifyEmail(token);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  verifyEmail(token: string): void {
    this.authService.verifyEmailToken(token).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.isSuccess = true;
        this.startCountdown();
      },
      error: (error: any) => {
        this.isLoading = false;
        this.isSuccess = false;
        if (error.status === 401) {
          this.errorMessage = 'El enlace de verificación es inválido o ha expirado.';
        } else {
          this.errorMessage = 'Ocurrió un error al verificar tu correo. Por favor intenta nuevamente.';
        }

        // También redirigir en caso de error después de 10 segundos
        this.startCountdown();
      }
    });
  }

  startCountdown(): void {
    this.countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(this.countdownInterval);
        this.router.navigate(['/auth/sign-in']);
      }
    }, 1000);
  }

  redirectNow(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
    this.router.navigate(['/auth/sign-in']);
  }
}
