import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface NoteDraft {
  title: string;
  content: string;
  isArchived?: boolean;
}

@Component({
  selector: 'app-note-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './note-input.html',
  styleUrls: ['./note-input.scss'],
})
export class NoteInputComponent {
  @Output() create = new EventEmitter<NoteDraft>();

  expanded = false;
  title = '';
  content = '';

  expand(): void {
    this.expanded = true;
  }

  close(): void {
    if (!this.title && !this.content) {
      this.expanded = false;
      return;
    }

    console.log('📝 CLOSE: Creating normal note');
    const noteData = {
      title: this.title,
      content: this.content,
      isArchived: false
    };
    console.log('📝 CLOSE: Emitting:', noteData);
    this.create.emit(noteData);

    this.title = '';
    this.content = '';
    this.expanded = false;
  }

  archiveNote(event: Event): void {
    event.stopPropagation();

    console.log('📦 ARCHIVE CLICKED!');
    console.log('📦 Title:', this.title);
    console.log('📦 Content:', this.content);

    if (!this.title && !this.content) {
      console.log('⚠️ Empty note - not archiving');
      return;
    }

    const noteData = {
      title: this.title,
      content: this.content,
      isArchived: true
    };

    console.log('📦 ARCHIVE: Emitting:', noteData);
    this.create.emit(noteData);

    this.title = '';
    this.content = '';
    this.expanded = false;
  }
}
