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
  @Output() update = new EventEmitter<any>();

  onDelete(): void {
    this.delete.emit(this.note.id);
  }
}
