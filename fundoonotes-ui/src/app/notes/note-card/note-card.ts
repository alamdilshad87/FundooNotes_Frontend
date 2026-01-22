import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-note-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './note-card.html',
  styleUrls: ['./note-card.scss']
})
export class NoteCardComponent {
  @Input() note: any;
  @Input() isColorPickerOpen: boolean = false;
  @Input() isInTrash: boolean = false; // ✅ ADD THIS

  @Output() delete = new EventEmitter<number>();
  @Output() archive = new EventEmitter<number>();
  @Output() togglePin = new EventEmitter<number>();
  @Output() noteClick = new EventEmitter<any>();
  @Output() updateColor = new EventEmitter<{noteId: number, color: string}>();
  @Output() toggleColorPicker = new EventEmitter<number>();
  @Output() restore = new EventEmitter<number>(); // ✅ ADD THIS

  showMenu = false;

  colors = [
    { name: 'Default', value: '#ffffff' },
    { name: 'Red', value: '#f28b82' },
    { name: 'Orange', value: '#fbbc04' },
    { name: 'Yellow', value: '#fff475' },
    { name: 'Green', value: '#ccff90' },
    { name: 'Teal', value: '#a7ffeb' },
    { name: 'Blue', value: '#cbf0f8' },
    { name: 'Dark Blue', value: '#aecbfa' },
    { name: 'Purple', value: '#d7aefb' },
    { name: 'Pink', value: '#fdcfe8' },
    { name: 'Brown', value: '#e6c9a8' },
    { name: 'Gray', value: '#e8eaed' }
  ];

  onCardClick(): void {
    if (!this.isInTrash) { // ✅ Don't open modal in trash
      this.noteClick.emit(this.note);
    }
  }

  onDelete(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.delete.emit(this.note.noteId);
    this.showMenu = false;
  }

  onArchive(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.archive.emit(this.note.noteId);
    this.showMenu = false;
  }

  onTogglePin(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.togglePin.emit(this.note.noteId);
  }

  // ✅ ADD THIS METHOD
  onRestore(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.restore.emit(this.note.noteId);
    this.showMenu = false;
  }

  toggleMenu(event: Event): void {
    event.stopPropagation();
    this.showMenu = !this.showMenu;
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
