import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-otp-verify',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './otp-verify.html',
  styleUrls: ['./otp-verify.scss']
})
export class OtpVerifyComponent {

  otpSessionId!: string;
  type!: 'LOGIN' | 'REGISTER';
  email!: string;

  loading = false;
  error = '';

  otpForm = new FormGroup({
    otp: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6)
      ]
    })
  });

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    const session = this.authService.getOtpSession();

    if (!session.otpSessionId || !session.type) {
      this.router.navigate(['/login']);
      return;
    }

    this.otpSessionId = session.otpSessionId;
    this.type = session.type;
    this.email = session.email!;
  }

  verifyOtp(): void {
    if (this.otpForm.invalid) return;

    this.loading = true;

    this.authService.verifyOtp({
      otp: this.otpForm.value.otp!,
      otpSessionId: this.otpSessionId
    }).subscribe({
      next: (res) => {
        this.authService.storeToken(res.token);
        this.authService.clearOtpSession();
        this.router.navigate(['/login']);
      },
      error: () => {
        this.error = 'Invalid or expired OTP';
        this.loading = false;
      }
    });
  }
}
