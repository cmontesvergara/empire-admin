import { CommonModule, } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.scss'],
  standalone: true,
  imports: [FormsModule, ButtonComponent,CommonModule],
  providers: [AuthService],
})
export class EmailVerificationComponent implements OnInit {
  nit: string = '';
  password: string = '';
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) { }
  public inputs = Array(6);

  ngOnInit(): void {
    const { nit, password } = JSON.parse(
      sessionStorage.getItem('sign-data') || '{}',
    );
    this.nit = nit
    this.password = password
  }
  onInputChange( event: any, index: number) {
    this.inputs[index] = event.target.value;
    if (event.target.value) {
      if (index < this.inputs.length - 1) {
        (document.getElementById(`input-${index + 1}`) as HTMLInputElement).focus();
      }
    }

  }
  onSubmit() {
    const otpCode = this.inputs.join('');
    this.authService.validateEmailOtpCode(this.nit, otpCode).subscribe(
      (response: any) => {
        if (response.code === 200 && response.resultCode === 'SUCCESS') {
          sessionStorage.removeItem('sign-data');
          this.authService.signIn(this.nit, this.password).subscribe(
            (response: any) => {
              sessionStorage.setItem('access_token', response.access_token);
              this.router.navigate(['/']);
            },
            (error: any) => {
              console.error(error);
            },
          )
        }
      },
      (error: any) => {
        this.inputs = Array(6);
        alert(error.error.message);
        this.router.navigate(['/auth/sign-in']);
      },
    );
  }
}
