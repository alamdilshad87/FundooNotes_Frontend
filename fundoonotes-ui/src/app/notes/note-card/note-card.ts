import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-note-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './note-card.html',
  styleUrls: ['./note-card.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush // ✅ PERFORMANCE BOOST
})
export class NoteCardComponent {
  @Input() note: any;
  @Input() isColorPickerOpen: boolean = false;
  @Input() isInTrash: boolean = false;

  @Output() delete = new EventEmitter<number>();
  @Output() archive = new EventEmitter<number>();
  @Output() togglePin = new EventEmitter<number>();
  @Output() noteClick = new EventEmitter<any>();
  @Output() updateColor = new EventEmitter<{noteId: number, color: string}>();
  @Output() toggleColorPicker = new EventEmitter<number>();
  @Output() restore = new EventEmitter<number>();

  showMenu = false;

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

  onCardClick(): void {
    if (!this.isInTrash) {
      this.noteClick.emit(this.note);
    }
  }

  onDelete(event?: Event): void {
    if (event) event.stopPropagation();
    this.delete.emit(this.note.noteId);
    this.showMenu = false;
  }

  onArchive(event?: Event): void {
    if (event) event.stopPropagation();
    this.archive.emit(this.note.noteId);
    this.showMenu = false;
  }

  onTogglePin(event?: Event): void {
    if (event) event.stopPropagation();
    this.togglePin.emit(this.note.noteId);
  }

  onRestore(event?: Event): void {
    if (event) event.stopPropagation();
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

  // ✅ PERFORMANCE: Track by function for *ngFor
  trackByColor(index: number, color: any): string {
    return color.value;
  }
}
