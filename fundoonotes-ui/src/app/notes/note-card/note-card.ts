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
  @Output() delete = new EventEmitter<number>();
  @Output() noteClick = new EventEmitter<any>();

  onNoteClick(): void {
    this.noteClick.emit(this.note);
  }

  onDelete(event: Event): void {
    event.stopPropagation();
    if (confirm('Delete this note?')) {
      this.delete.emit(this.note.noteId);
    }
  }

  // Method to get the background style for the note
  getBackgroundStyle(): any {
    const color = this.note.color || 'transparent';

    // Check if it's a gradient
    if (color.startsWith('linear-gradient') || color.startsWith('repeating-linear-gradient')) {
      return { 'background': color };
    }

    // Otherwise it's a solid color
    return { 'background-color': color === 'transparent' ? '#fff' : color };
  }
}
