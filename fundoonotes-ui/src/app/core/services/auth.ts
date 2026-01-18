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

  private otpSessionId: string | null = null;
  private otpEmail: string | null = null;
  private otpType: 'LOGIN' | 'REGISTER' | null = null;

  constructor(private http: HttpClient) {}

  setOtpSession(id: string, email: string, type: 'LOGIN' | 'REGISTER'): void {
  sessionStorage.setItem('otpSessionId', id);
  sessionStorage.setItem('otpEmail', email);
  sessionStorage.setItem('otpType', type);
}

getOtpSession() {
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
    username: string;
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
  }): Observable<VerifyOtpResponse> {
    return this.http.post<VerifyOtpResponse>(
      `${this.BASE_URL}/verify-otp`,
      data
    );
  }

  storeToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }
}
