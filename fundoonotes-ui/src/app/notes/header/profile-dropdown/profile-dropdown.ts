import { Component, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-profile-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-dropdown.html',
  styleUrls: ['./profile-dropdown.scss']
})
export class ProfileDropdownComponent {
  @Output() close = new EventEmitter<void>();

  userEmail: string = '';
  firstName: string = '';
  userInitial: string = 'U';

  constructor(
    private authService: AuthService,
    private router: Router,
    private elementRef: ElementRef
  ) {
    this.loadUserInfo();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.close.emit();
    }
  }

  loadUserInfo(): void {
    const token = this.authService.getToken();
    console.log('🎫 Raw Token:', token);

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('📦 Decoded Payload:', JSON.stringify(payload, null, 2));

        // Extract email (handle different claim formats)
        this.userEmail = payload.email ||
                        payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ||
                        payload.sub ||
                        'user@example.com';

        // Extract first name (handle different claim formats)
        this.firstName = payload.firstName ||
                        payload.given_name ||
                        payload.name ||
                        this.userEmail.split('@')[0];

        // Capitalize first letter
        this.firstName = this.firstName.charAt(0).toUpperCase() + this.firstName.slice(1);

        // Get initial
        this.userInitial = this.firstName.charAt(0).toUpperCase();

        console.log('👤 User Info:', { email: this.userEmail, firstName: this.firstName, initial: this.userInitial });
      } catch (e) {
        console.error('❌ Error parsing token:', e);
        this.userEmail = 'user@example.com';
        this.firstName = 'User';
        this.userInitial = 'U';
      }
    } else {
      console.log('❌ No token found');
      this.userEmail = 'user@example.com';
      this.firstName = 'User';
      this.userInitial = 'U';
    }
  }

  signOut(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  closeDropdown(event: Event): void {
    event.stopPropagation();
    this.close.emit();
  }
}
