import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    AngularSvgIconModule,
    ButtonComponent,
  ],
  providers: [AuthService],
})
export class SignUpComponent implements OnInit {
  signUpForm!: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {
    this.signUpForm = this.fb.group({
      name: ['', Validators.required],
      last_name: ['', Validators.required],
      nit: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue],
    });
  }

  ngOnInit(): void {}
  onSubmit() {
    if (
      this.signUpForm.value.password ===
        this.signUpForm.value.confirmPassword &&
      this.signUpForm.value.acceptTerms &&
      this.signUpForm.valid
    ) {
      const payload = {
        user: {
          basic_information: {
            name: this.signUpForm.value.name,
            last_name: this.signUpForm.value.last_name,
            phone: this.signUpForm.value.phone,
            email: this.signUpForm.value.email,
            nit: this.signUpForm.value.nit,
          },
          secure_information: {
            password: this.signUpForm.value.confirmPassword,
          },
        },
      };
      this.authService.signUp(payload).subscribe(
        (res) => {
          this.router.navigate(['/auth/sign-in']);
        },
        (err) => {
          console.log(err);
        },
      );
    } else {
      console.log('Form invalid');
      console.log(this.signUpForm);
    }
  }
}
