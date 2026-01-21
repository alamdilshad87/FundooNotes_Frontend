import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabelSelectorComponent } from '../label-selector/label-selector';

@Component({
  selector: 'app-note-card',
  standalone: true,
  imports: [CommonModule, LabelSelectorComponent],
  templateUrl: './note-card.html',
  styleUrls: ['./note-card.scss']
})
export class NoteCardComponent {
  @Input() note: any;
  @Input() isColorPickerOpen: boolean = false;
  @Output() delete = new EventEmitter<number>();
  @Output() archive = new EventEmitter<number>();
  @Output() togglePin = new EventEmitter<number>();
  @Output() noteClick = new EventEmitter<any>();
  @Output() updateColor = new EventEmitter<{noteId: number, color: string}>();
  @Output() toggleColorPicker = new EventEmitter<number>();
  @Output() noteUpdated = new EventEmitter<void>();

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
    this.delete.emit(this.note.noteId);
  }

  onArchive(event: Event): void {
    event.stopPropagation();
    this.archive.emit(this.note.noteId);
  }

  onTogglePin(event: Event): void {
    event.stopPropagation();
    console.log('📌 Toggling pin for note:', this.note.noteId);
    this.togglePin.emit(this.note.noteId);
  }

  onToggleColorPicker(event: Event): void {
    event.stopPropagation();
    this.toggleColorPicker.emit(this.note.noteId);
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

  onLabelsChanged(): void {
    this.noteUpdated.emit();
  }
}
