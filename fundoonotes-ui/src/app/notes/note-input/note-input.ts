import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface NoteDraft {
  title: string;
  content: string;
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

    this.create.emit({
      title: this.title,
      content: this.content,
    });

    this.title = '';
    this.content = '';
    this.expanded = false;
  }
}
