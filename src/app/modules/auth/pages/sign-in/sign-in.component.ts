import { NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterLink, AngularSvgIconModule, NgClass, NgIf, ButtonComponent,],
  providers: [AuthService],
})
export class SignInComponent implements OnInit {
  form!: FormGroup;
  submitted = false;
  passwordTextType!: boolean;




    constructor(
      private readonly _formBuilder: FormBuilder,
      private readonly _router: Router,
      private readonly authService: AuthService,
      private readonly route: ActivatedRoute
    ) {
      this.form = this._formBuilder.group({
        nit: ['', [Validators.required, Validators.maxLength(10)]],
        password: ['', Validators.required],
      });
    }

    ngOnInit(): void {
      this.route.queryParams.subscribe(params => {
        const nit = params['nit'];
        if (nit) {
          this.form.patchValue({ nit });
        }
      });
    }


  get f() {
    return this.form.controls;
  }

  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  onSubmit() {
    this.submitted = true;
    const { nit, password } = this.form.value;


    this.authService.signIn(nit, password).subscribe(
      (response:any) => {
        /*
        response:
          {
          access_token: string;
          expired: number;
          message: string;
          resultCode: number;
        }

        */
        sessionStorage.setItem('access_token', response.access_token);
        this._router.navigate(['/']);
      },
      (error) => {

        if (
          error?.error?.code === 401 &&
          error?.error?.resultCode === 'UNAUTHORIZED'
        ) {
          this.form.controls['password'].setErrors({ invalid: true });
        }
        if (
          error?.error?.code === 403 &&
          error?.error?.resultCode === 'FORBIDDEN'
        ) {
          this.authService.sendEmailOtpCode(nit).subscribe(
            (res) => {
              sessionStorage.setItem('sign-in-nit', nit)
              sessionStorage.setItem('sign-in-pass', password)
              this._router.navigate(['/auth/email-verification']);
            },
            (err) => {
              console.log(err);
              alert('Error al enviar el codigo de verificacion');
            }
          )

        }
        if (
          error?.error?.code === 404 &&
          error?.error?.resultCode === 'RESOURCE_NOT_FOUND'
        ) {
          this.form.controls['nit'].setErrors({ invalid: true });
          this.form.controls['password'].setErrors({ invalid: true });
        }
      }
    )

  }
}
