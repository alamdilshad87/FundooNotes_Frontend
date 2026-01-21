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
  @Input() isColorPickerOpen: boolean = false; // ✅ ADD THIS
  @Output() delete = new EventEmitter<number>();
  @Output() noteClick = new EventEmitter<any>();
  @Output() updateColor = new EventEmitter<{noteId: number, color: string}>();
  @Output() toggleColorPicker = new EventEmitter<number>(); // ✅ CHANGED - now emits noteId

  solidColors = [
    { name: 'Default', value: 'transparent' },
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

  onNoteClick(): void {
    this.noteClick.emit(this.note);
  }

  onDelete(event: Event): void {
    event.stopPropagation();
    if (confirm('Delete this note?')) {
      this.delete.emit(this.note.noteId);
    }
  }

  // ✅ UPDATED METHOD
  onToggleColorPicker(event: Event): void {
    event.stopPropagation();
    this.toggleColorPicker.emit(this.note.noteId); // Emit noteId to parent
  }

  selectColor(colorValue: string, event: Event): void {
    event.stopPropagation();
    console.log('🎨 Color selected:', colorValue, 'for note:', this.note.noteId);
    this.updateColor.emit({ noteId: this.note.noteId, color: colorValue });
  }

  getBackgroundStyle(): any {
    const color = this.note.color || 'transparent';
    return { 'background-color': color === 'transparent' ? '#fff' : color };
  }
}
