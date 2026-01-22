import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() search = new EventEmitter<string>();

  searchQuery = '';
  userEmail = '';
  private searchSubject = new Subject<string>();

  constructor(private authService: AuthService) {
    this.userEmail = 'user@example.com';

    // ✅ Debounce search - wait 300ms after user stops typing
    this.searchSubject.pipe(
      debounceTime(300)
    ).subscribe(query => {
      console.log('🔍 Emitting search:', query);
      this.search.emit(query);
    });
  }

  onSearch(): void {
    this.searchSubject.next(this.searchQuery.trim());
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.search.emit('');
  }

  getInitials(): string {
    if (!this.userEmail) return 'U';
    return this.userEmail.charAt(0).toUpperCase();
  }

  onLogout(): void {
    this.authService.logout();
  }
}
