import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabelDropdownComponent } from '../label-dropdown/label-dropdown';

@Component({
  selector: 'app-note-card',
  standalone: true,
  imports: [CommonModule, LabelDropdownComponent],
  templateUrl: './note-card.html',
  styleUrls: ['./note-card.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoteCardComponent {
  @Input() note: any;
  @Input() isColorPickerOpen: boolean = false;
  @Input() isInTrash: boolean = false;
  @Input() labelViewMode: boolean = false;

  @Output() delete = new EventEmitter<number>();
  @Output() archive = new EventEmitter<number>();
  @Output() togglePin = new EventEmitter<number>();
  @Output() noteClick = new EventEmitter<any>();
  @Output() updateColor = new EventEmitter<{noteId: number, color: string}>();
  @Output() toggleColorPicker = new EventEmitter<number>();
  @Output() restore = new EventEmitter<number>();
  @Output() labelsUpdated = new EventEmitter<{noteId: number, labels: string[]}>();

  showMenu = false;
  showLabelDropdown = false;

  colors = [
    { name: 'Default', value: '#ffffff' },
    { name: 'Coral', value: '#f28b82' },
    { name: 'Peach', value: '#fbbc04' },
    { name: 'Sand', value: '#fff475' },
    { name: 'Mint', value: '#ccff90' },
    { name: 'Sage', value: '#a7ffeb' },
    { name: 'Fog', value: '#cbf0f8' },
    { name: 'Storm', value: '#aecbfa' },
    { name: 'Dusk', value: '#d7aefb' },
    { name: 'Blossom', value: '#fdcfe8' },
    { name: 'Clay', value: '#e6c9a8' },
    { name: 'Chalk', value: '#e8eaed' }
  ];

  // ✅ LISTEN FOR CLICKS OUTSIDE
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const clickedInside = target.closest('.note-card');

    if (!clickedInside || !clickedInside.isSameNode(event.currentTarget as Node)) {
      this.showMenu = false;
      this.showLabelDropdown = false;
    }
  }

  onCardClick(): void {
    if (!this.isInTrash) {
      this.noteClick.emit(this.note);
    }
  }

  onDelete(event?: Event): void {
    if (event) event.stopPropagation();
    this.delete.emit(this.note.noteId);
    this.showMenu = false;
    this.showLabelDropdown = false;
  }

  onArchive(event?: Event): void {
    if (event) event.stopPropagation();
    this.archive.emit(this.note.noteId);
    this.showMenu = false;
    this.showLabelDropdown = false;
  }

  onTogglePin(event?: Event): void {
    if (event) event.stopPropagation();
    this.togglePin.emit(this.note.noteId);
  }

  onRestore(event?: Event): void {
    if (event) event.stopPropagation();
    this.restore.emit(this.note.noteId);
    this.showMenu = false;
    this.showLabelDropdown = false;
  }

  toggleMenu(event: Event): void {
    event.stopPropagation();
    this.showMenu = !this.showMenu;
    this.showLabelDropdown = false; // Close label dropdown when menu toggles
  }

  toggleLabelDropdown(event: Event): void {
    event.stopPropagation();
    this.showLabelDropdown = !this.showLabelDropdown;
    this.showMenu = false; // Close menu when label dropdown opens
  }

  onLabelsChanged(labels: string[]): void {
    this.note.labels = labels;
    this.labelsUpdated.emit({ noteId: this.note.noteId, labels });
    // ✅ KEEP DROPDOWN OPEN - Don't auto-close so user can select multiple labels
  }

  // ✅ ADD THIS - Close dropdown from child component
  closeLabelDropdown(): void {
    this.showLabelDropdown = false;
  }

  onColorClick(color: string, event: Event): void {
    event.stopPropagation();
    this.updateColor.emit({ noteId: this.note.noteId, color: color });
  }

  onToggleColorPicker(event: Event): void {
    event.stopPropagation();
    this.toggleColorPicker.emit(this.note.noteId);
  }
}
