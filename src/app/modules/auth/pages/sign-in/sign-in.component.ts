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
import { LoadingService } from 'src/app/core/services/loading/loading.service';
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
    public loadingService: LoadingService,
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
        // Check if 2FA is required
        if (response.requiresTwoFactor) {
          // Redirect to 2FA validation page with tempToken
          this.router.navigate(['/auth/two-steps'], {
            queryParams: {
              token: response.tempToken,
              validate: 'true'
            }
          });
          return;
        }

        // Normal login flow (no 2FA)
        this.sessionStorageService.saveAccessToken(response.tokens.accessToken);
        this.sessionStorageService.saveRefreshToken(
          response.tokens.refreshToken,
        );

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
        console.log('Error signIn:', error);
        if (error?.error === 'ACCOUNT_NOT_ACTIVE') {
          // Extract encoded userId from error details if available
          const encodedUserId = error?.errors?.[0]?.userId;

          if (encodedUserId) {
            this.loadingService.loading = true;
            // Redirect to email verification with userId as query param
            this.router.navigate(['/auth/email-verification'], {
              queryParams: { userId: encodedUserId },
            });
          }
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
