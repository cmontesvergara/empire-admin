import { NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
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
    private readonly authService: AuthService
  ) { }

  onClick() {
    console.log('Button clicked');
  }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      nit: ['', [Validators.required, Validators.maxLength(10)]],
      password: ['', Validators.required],
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

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
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
        console.log(error);
        alert(error?.error?.message);
      }
    )

  }
}
