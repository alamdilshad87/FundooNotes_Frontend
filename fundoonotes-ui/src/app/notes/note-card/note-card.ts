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
  @Output() noteClick = new EventEmitter<any>();  // ✅ Renamed from 'click' to 'noteClick'


  onNoteClick(): void {
    this.noteClick.emit(this.note);  // ✅ Emits the note object
  }


  onDelete(event: Event): void {
    event.stopPropagation();
    if (confirm('Delete this note?')) {
      this.delete.emit(this.note.noteId);  // ✅ Fixed: use noteId instead of id
    }
  }
}
