import { Component, Output, EventEmitter, ViewChild, ElementRef, HostListener } from '@angular/core';
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
  @ViewChild('titleEditor') titleEditor!: ElementRef;
  @ViewChild('contentEditor') contentEditor!: ElementRef;
  @ViewChild('noteContainer') noteContainer!: ElementRef;


  isExpanded = false;
  title: string = '';
  content: string = '';
  color: string = 'white';


  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.isExpanded && this.noteContainer) {
      const clickedInside = this.noteContainer.nativeElement.contains(event.target);
      if (!clickedInside) {
        this.close();
      }
    }
  }


  expand(): void {
    this.isExpanded = true;
  }


  close(): void {
    if (this.title.trim() || this.content.trim()) {
      this.saveNote();
    }
    this.isExpanded = false;
  }


  saveNote(): void {
    const noteData = {
      title: this.title.trim(),
      content: this.content.trim(),
      color: this.color
    };

    if (noteData.title || noteData.content) {
      this.save.emit(noteData);
      this.title = '';
      this.content = '';
      this.color = 'white';
      
      // Clear contenteditable divs
      if (this.titleEditor) {
        this.titleEditor.nativeElement.innerHTML = '';
      }
      if (this.contentEditor) {
        this.contentEditor.nativeElement.innerHTML = '';
      }
    }
  }


  onTitleInput(event: Event): void {
    const target = event.target as HTMLElement;
    this.title = target.innerHTML;
  }


  onContentInput(event: Event): void {
    const target = event.target as HTMLElement;
    this.content = target.innerHTML;
  }


  formatText(command: string): void {
    document.execCommand(command, false, undefined);
  }
}
