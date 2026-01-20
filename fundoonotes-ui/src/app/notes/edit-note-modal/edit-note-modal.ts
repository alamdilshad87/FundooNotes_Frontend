import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-edit-note-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-note-modal.html',
  styleUrls: ['./edit-note-modal.scss']
})
export class EditNoteModalComponent implements OnInit, AfterViewInit {
  @Input() note: any;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();
  
  @ViewChild('modalBackdrop') modalBackdrop!: ElementRef;
  @ViewChild('titleEditor') titleEditor!: ElementRef;
  @ViewChild('contentEditor') contentEditor!: ElementRef;


  title: string = '';
  content: string = '';
  color: string = 'white';


  ngOnInit(): void {
    console.log('Modal received note:', this.note);
    if (this.note) {
      this.title = this.note.title || '';
      this.content = this.note.content || '';
      this.color = this.note.color || 'white';
    }
  }


  ngAfterViewInit(): void {
    // Set innerHTML after view is initialized
    if (this.titleEditor && this.title) {
      this.titleEditor.nativeElement.innerHTML = this.title;
    }
    if (this.contentEditor && this.content) {
      this.contentEditor.nativeElement.innerHTML = this.content;
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


  onBackdropClick(event: MouseEvent): void {
    if (event.target === this.modalBackdrop.nativeElement) {
      this.saveAndClose();
    }
  }


  saveAndClose(): void {
    if (this.title !== this.note.title || this.content !== this.note.content) {
      const updatedNote = {
        noteId: this.note.noteId,
        title: this.title,
        content: this.content,
        color: this.color
      };
      console.log('Emitting updated note:', updatedNote);
      this.save.emit(updatedNote);
    } else {
      console.log('No changes detected, closing without save');
    }
    this.close.emit();
  }


  handleClose(): void {
    this.saveAndClose();
  }
}
