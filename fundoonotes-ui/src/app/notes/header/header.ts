import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth';
import { ViewModeService, ViewMode } from '../../core/services/view-mode';
import { debounceTime, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() search = new EventEmitter<string>();

  searchQuery = '';
  userEmail = '';
  viewMode: ViewMode = 'grid'; // ✅ NEW
  private searchSubject = new Subject<string>();
  private viewModeSubscription?: Subscription; // ✅ NEW

  constructor(
    private authService: AuthService,
    private viewModeService: ViewModeService // ✅ NEW
  ) {
    this.userEmail = 'user@example.com';

    this.searchSubject.pipe(
      debounceTime(300)
    ).subscribe(query => {
      console.log('🔍 Emitting search:', query);
      this.search.emit(query);
    });
  }

  ngOnInit(): void {
    // ✅ Subscribe to view mode changes
    this.viewModeSubscription = this.viewModeService.viewMode$.subscribe(mode => {
      this.viewMode = mode;
    });
  }

  ngOnDestroy(): void {
    this.viewModeSubscription?.unsubscribe();
  }

  onSearch(): void {
    this.searchSubject.next(this.searchQuery.trim());
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.search.emit('');
  }

  // ✅ NEW - Toggle view mode
  toggleViewMode(): void {
    this.viewModeService.toggleViewMode();
  }

  getInitials(): string {
    if (!this.userEmail) return 'U';
    return this.userEmail.charAt(0).toUpperCase();
  }

  onLogout(): void {
    this.authService.logout();
  }
}
