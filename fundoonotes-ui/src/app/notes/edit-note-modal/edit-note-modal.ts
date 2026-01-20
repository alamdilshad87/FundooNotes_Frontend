import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit, OnInit } from '@angular/core';
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


  title: string = '';
  content: string = '';
  color: string = 'white';


  // ✅ FIX: Use ngOnInit instead of ngAfterViewInit for data initialization
  ngOnInit(): void {
    console.log('Modal received note:', this.note);
    if (this.note) {
      this.title = this.note.title || '';
      this.content = this.note.content || '';
      this.color = this.note.color || 'white';
    }
  }

  ngAfterViewInit(): void {
    // Keep this empty or use for DOM-related operations only
  }


  onBackdropClick(event: MouseEvent): void {
    if (event.target === this.modalBackdrop.nativeElement) {
      this.saveAndClose();
    }
  }


  saveAndClose(): void {
    // ✅ FIX: Always include noteId in the updated note object
    if (this.title !== this.note.title || this.content !== this.note.content) {
      const updatedNote = {
        noteId: this.note.noteId,  // ✅ Include noteId
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
