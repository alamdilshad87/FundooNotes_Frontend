import { Component, EventEmitter, Output, ViewChild, ElementRef, HostListener } from '@angular/core';
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
  @Output() save = new EventEmitter<any>();
  @ViewChild('noteBox') noteBox!: ElementRef;

  expanded = false;
  title = '';
  content = '';

  expand(): void {
    this.expanded = true;
  }

  close(): void {
    if (this.title.trim() || this.content.trim()) {
      this.save.emit({
        title: this.title.trim(),
        content: this.content.trim()
      });
    }
    this.reset();
  }

  reset(): void {
    this.title = '';
    this.content = '';
    this.expanded = false;
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event): void {
    if (this.expanded && this.noteBox && !this.noteBox.nativeElement.contains(event.target)) {
      this.close();
    }
  }
}
