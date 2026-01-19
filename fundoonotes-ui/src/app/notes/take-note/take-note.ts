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

  expanded = false;
  title = '';
  content = '';

  @Output() save = new EventEmitter<any>();

  expand(): void {
    this.expanded = true;
  }

  collapse(): void {
    if (!this.title.trim() && !this.content.trim()) {
      this.expanded = false;
      return;
    }

    this.save.emit({
      title: this.title,
      content: this.content
    });

    this.title = '';
    this.content = '';
    this.expanded = false;
  }
}
