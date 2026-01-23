import { Component, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/services/theme';

@Component({
  selector: 'app-settings-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings-dropdown.html',
  styleUrls: ['./settings-dropdown.scss']
})
export class SettingsDropdownComponent {
  @Output() close = new EventEmitter<void>();

  isDarkMode = false;

  constructor(
    private elementRef: ElementRef,
    private themeService: ThemeService
  ) {
    this.isDarkMode = this.themeService.getDarkMode();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.close.emit();
    }
  }

  toggleDarkTheme(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.themeService.toggleDarkMode();
    this.isDarkMode = this.themeService.getDarkMode();

    // ✅ Close dropdown after toggling theme
    setTimeout(() => {
      this.close.emit();
    }, 150);
  }

  closeDropdown(event?: Event): void {
    if (event) event.stopPropagation();
    this.close.emit();
  }
}
