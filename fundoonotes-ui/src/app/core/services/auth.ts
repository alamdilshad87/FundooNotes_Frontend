import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OtpInitResponse {
  otpSessionId: string;
}

export interface VerifyOtpResponse {
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly BASE_URL = 'https://localhost:7204/api/auth';

  constructor(private http: HttpClient) {}

  setOtpSession(data: {
    otpSessionId: string;
    email: string;
    type: 'LOGIN' | 'REGISTER';
  }): void {
    sessionStorage.setItem('otpSessionId', data.otpSessionId);
    sessionStorage.setItem('otpEmail', data.email);
    sessionStorage.setItem('otpType', data.type);
  }

  getOtpSession(): {
    otpSessionId: string | null;
    email: string | null;
    type: 'LOGIN' | 'REGISTER' | null;
  } {
    return {
      otpSessionId: sessionStorage.getItem('otpSessionId'),
      email: sessionStorage.getItem('otpEmail'),
      type: sessionStorage.getItem('otpType') as 'LOGIN' | 'REGISTER' | null
    };
  }

  clearOtpSession(): void {
    sessionStorage.removeItem('otpSessionId');
    sessionStorage.removeItem('otpEmail');
    sessionStorage.removeItem('otpType');
  }

  register(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Observable<OtpInitResponse> {
    return this.http.post<OtpInitResponse>(
      `${this.BASE_URL}/register`,
      data
    );
  }

  login(data: {
    email: string;
    password: string;
  }): Observable<OtpInitResponse> {
    return this.http.post<OtpInitResponse>(
      `${this.BASE_URL}/login`,
      data
    );
  }

  verifyOtp(data: {
    otp: string;
    otpSessionId: string;
    email: string;
    purpose: 'verify' | 'login' | 'reset';
  }): Observable<VerifyOtpResponse> {
    return this.http.post<VerifyOtpResponse>(
      `${this.BASE_URL}/verify-otp`,
      data
    );
  }

  resendOtp(data: {
    email: string;
    purpose: 'verify' | 'login' | 'reset';
  }): Observable<{ otpSessionId: string }> {
    return this.http.post<{ otpSessionId: string }>(
      `${this.BASE_URL}/resend-otp`,
      data
    );
  }

  storeToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    this.clearOtpSession();
  }
}
