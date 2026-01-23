import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth';
import { ViewModeService, ViewMode } from '../../core/services/view-mode';
import { ProfileDropdownComponent } from './profile-dropdown/profile-dropdown';
import { SettingsDropdownComponent } from './settings-dropdown/settings-dropdown';
import { debounceTime, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, ProfileDropdownComponent, SettingsDropdownComponent],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() search = new EventEmitter<string>();

  searchQuery = '';
  userEmail = '';
  viewMode: ViewMode = 'grid';
  showProfileDropdown = false;
  showSettingsDropdown = false; // ✅ ADD THIS

  private searchSubject = new Subject<string>();
  private viewModeSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private viewModeService: ViewModeService
  ) {
    this.loadUserEmail();

    this.searchSubject.pipe(
      debounceTime(300)
    ).subscribe(query => {
      console.log('🔍 Emitting search:', query);
      this.search.emit(query);
    });
  }

  ngOnInit(): void {
    this.viewModeSubscription = this.viewModeService.viewMode$.subscribe(mode => {
      this.viewMode = mode;
    });
  }

  ngOnDestroy(): void {
    this.viewModeSubscription?.unsubscribe();
  }

  loadUserEmail(): void {
    const token = this.authService.getToken();

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));

        this.userEmail = payload.email ||
                        payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ||
                        payload.sub ||
                        'user@example.com';

        console.log('📧 User Email:', this.userEmail);
      } catch (e) {
        console.error('❌ Error parsing token:', e);
        this.userEmail = 'user@example.com';
      }
    } else {
      this.userEmail = 'user@example.com';
    }
  }

  onSearch(): void {
    this.searchSubject.next(this.searchQuery.trim());
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.search.emit('');
  }

  toggleViewMode(): void {
    this.viewModeService.toggleViewMode();
  }

  // ✅ ADD THIS METHOD
  toggleSettingsDropdown(): void {
    this.showSettingsDropdown = !this.showSettingsDropdown;
    this.showProfileDropdown = false; // Close profile dropdown
    console.log('⚙️ Settings dropdown:', this.showSettingsDropdown);
  }

  // ✅ ADD THIS METHOD
  closeSettingsDropdown(): void {
    this.showSettingsDropdown = false;
  }

  toggleProfileDropdown(): void {
    this.showProfileDropdown = !this.showProfileDropdown;
    this.showSettingsDropdown = false; // Close settings dropdown
    console.log('🔽 Profile dropdown:', this.showProfileDropdown);
  }

  closeProfileDropdown(): void {
    this.showProfileDropdown = false;
  }

  getInitials(): string {
    if (!this.userEmail) return 'U';
    return this.userEmail.charAt(0).toUpperCase();
  }

  onLogout(): void {
    this.authService.logout();
  }
}
