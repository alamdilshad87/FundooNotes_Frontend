import { Component, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings-dropdown.html',
  styleUrls: ['./settings-dropdown.scss']
})
export class SettingsDropdownComponent {
  @Output() close = new EventEmitter<void>();

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.close.emit();
    }
  }

  closeDropdown(event?: Event): void {
    if (event) event.stopPropagation();
    this.close.emit();
  }
}
