import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { emailVerificationGuard } from 'src/app/core/guards/email-verification/email-verification.guard';
import { logOutGuard } from 'src/app/core/guards/log-out/log-out.guard';
import { AuthComponent } from './auth.component';
import { EmailVerificationComponent } from './pages/email-verification/email-verification.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { NewPasswordComponent } from './pages/new-password/new-password.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { TwoStepsComponent } from './pages/two-steps/two-steps.component';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
      {
        path: 'sign-in',
        component: SignInComponent,
        data: { returnUrl: window.location.pathname },
      },
      {
        path: 'sign-out',
        component: SignInComponent,
        canActivate: [logOutGuard],
      },
      { path: 'sign-up', component: SignUpComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'new-password', component: NewPasswordComponent },
      { path: 'two-steps', component: TwoStepsComponent },
      {
        path: 'email-verification',
        component: EmailVerificationComponent,
        canActivate: [emailVerificationGuard],
      },
      { path: '**', redirectTo: 'sign-in', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
