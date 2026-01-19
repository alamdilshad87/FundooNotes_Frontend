import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-take-note',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './take-note.html',
  styleUrls: ['./take-note.scss']
})
export class TakeNoteComponent {
  @Output() save = new EventEmitter<{ title: string; content: string }>();

  isExpanded = false;
  title = '';
  content = '';

  expand(): void {
    this.isExpanded = true;
  }

  close(): void {
    if (this.title.trim() || this.content.trim()) {
      this.save.emit({
        title: this.title,
        content: this.content
      });
    }
    
    this.isExpanded = false;
    this.title = '';
    this.content = '';
  }
}
