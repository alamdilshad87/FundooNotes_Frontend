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
  resendDisabled = true;
  timer = 30;
  intervalId: any;

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

    if (!session.otpSessionId || !session.type || !session.email) {
      this.router.navigate(['/login']);
      return;
    }

    this.otpSessionId = session.otpSessionId;
    this.type = session.type;
    this.email = session.email;
    this.startResendTimer();
  }

  verifyOtp(): void {
    if (this.otpForm.invalid) return;

    this.loading = true;
    this.error = '';

    const session = this.authService.getOtpSession();

    this.authService.verifyOtp({
      otp: this.otpForm.value.otp!,
      otpSessionId: session.otpSessionId!,
      email: session.email!,
      purpose: session.type === 'REGISTER' ? 'verify' : 'login'
    }).subscribe({
      next: (res) => {
        this.authService.storeToken(res.token);
        this.router.navigate(['/']);
      },
      error: () => {
        this.error = 'Invalid or expired OTP';
        this.loading = false;
      }
    });
  }

  startResendTimer(): void {
    this.resendDisabled = true;
    this.timer = 30;

    this.intervalId = setInterval(() => {
      this.timer--;
      if (this.timer === 0) {
        this.resendDisabled = false;
        clearInterval(this.intervalId);
      }
    }, 1000);
  }

  resendOtp(): void {
    if (this.resendDisabled) return;

    this.resendDisabled = true;
    this.error = '';

    const session = this.authService.getOtpSession();

    this.authService.resendOtp({
      email: session.email!,
      purpose: session.type === 'REGISTER' ? 'verify' : 'login'
    }).subscribe({
      next: (res) => {
        this.authService.setOtpSession({
          otpSessionId: res.otpSessionId,
          email: session.email!,
          type: session.type!
        });

        this.startResendTimer();
      },
      error: () => {
        this.error = 'Failed to resend OTP';
        this.resendDisabled = false;
      }
    });
  }

}