import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  standalone: true,
  imports: [FormsModule, RouterLink, ButtonComponent, CommonModule, ReactiveFormsModule],
  providers: [AuthService],
})
export class ForgotPasswordComponent implements OnInit {
  nit: string = '';
  constructor(private readonly authService:AuthService) {}

  ngOnInit(): void {}
  onSubmit() {
    this.authService.sendEmailRecovery(this.nit).subscribe(
      (response: any) => {
        console.log(response);
      },
      (error: any) => {
        console.error(error);
      }
    )
  }



}
