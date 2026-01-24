import { CommonModule, } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.scss'],
  standalone: true,
  imports: [FormsModule, ButtonComponent, CommonModule, RouterModule],
  providers: [AuthService],
})
export class EmailVerificationComponent {
  email: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private readonly authService: AuthService,
  ) {}

  requestVerificationCode() {
    if (!this.email || !this.email.trim()) {
      this.errorMessage = 'Por favor ingresa tu correo electrónico';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.sendEmailOtpCode(this.email).subscribe(
      (response: any) => {
        this.isLoading = false;
        this.successMessage = 'Si hay una cuenta vinculada a este correo, se enviará un link de verificación.';
        this.email = '';
      },
      (error: any) => {
        this.isLoading = false;
        this.successMessage = 'Si hay una cuenta vinculada a este correo, se enviará un link de verificación.';
        this.email = '';
      }
    );
  }
}
