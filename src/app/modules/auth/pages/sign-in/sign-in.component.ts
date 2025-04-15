import { NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { toast } from 'ngx-sonner';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { LocalStorageService } from 'src/app/core/services/local-storage/local-storage.service';
import { SessionStorageService } from 'src/app/core/services/session-storage/session-storage.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    AngularSvgIconModule,
    NgClass,
    NgIf,
    ButtonComponent,
  ],
  providers: [AuthService],
})
export class SignInComponent implements OnInit {
  form!: FormGroup;
  submitted = false;
  passwordTextType!: boolean;
  constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly route: ActivatedRoute,
    private readonly localStorageService: LocalStorageService,
    private readonly sessionStorageService: SessionStorageService,
  ) {
    this.form = this._formBuilder.group({
      nit: ['', [Validators.required, Validators.maxLength(10)]],
      password: ['', Validators.required],
      remember: [''],
    });

    this.form.controls['remember'].valueChanges.subscribe((value) => {
      if (!value) {
        this.form.reset();
        this.localStorageService.removeRememberLoginCredentials();
      }
    });
  }

  ngOnInit(): void {
    const rememberLoginCredentials =
      this.localStorageService.getRememberLoginCredentials();
    if (rememberLoginCredentials) {
      this.form.patchValue({
        nit: rememberLoginCredentials.nit,
        password: rememberLoginCredentials.password,
        remember: true,
      });
    }
    this.route.queryParams.subscribe((params) => {
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
      (response: any) => {
        /*
        response:
          {
          access_token: string;
          expired: number;
          message: string;
          resultCode: number;
        }

        */
        this.sessionStorageService.saveAccessToken(response.access_token);

        if (this.form.controls['remember'].value) {
          this.localStorageService.setRememberLoginCredentials({
            nit,
            password,
          });
        }
        const lastUrlUsed = this.sessionStorageService.getLastUrl();
        if (lastUrlUsed && lastUrlUsed !== this.router.url) {
          this.router.navigateByUrl(lastUrlUsed);
        } else {
          this.router.navigate(['/']);
        }
      },
      (error) => {
        if (error?.code === 401 && error?.resultCode === 'UNAUTHORIZED') {
          this.form.controls['password'].setErrors({ invalid: true });

          toast.error('Valida tus credenciales.', {
            position: 'bottom-right',
            description: 'Parece que tus credenciales no coinciden.',
          });
        }
        if (error?.code === 403 && error?.resultCode === 'FORBIDDEN') {
          this.authService.sendEmailOtpCode(nit).subscribe(
            (res) => {
              const signData = {
                nit,
                password,
              };
              this.sessionStorageService.saveSignData(signData);

              this.router.navigate(['/auth/email-verification']);
            },
            (err) => {
              if (
                error?.error?.code === 403 &&
                error?.error?.resultCode === 'FORBIDDEN'
              ) {
                alert('Usuario bloquedo temporalmente, intenta mas tarde');
              } else {
                alert(
                  'Error al enviar el codigo de verificacion, intenta mas tarde',
                );
              }
            },
          );
        }
        if (error?.code === 404 && error?.resultCode === 'RESOURCE_NOT_FOUND') {
          this.form.controls['nit'].setErrors({ invalid: true });
          this.form.controls['password'].setErrors({ invalid: true });
        }
      },
    );
  }
  toggleRememberButton() {
    this.form.controls['remember'].patchValue(
      !this.form.controls['remember'].value,
    );
  }
}
