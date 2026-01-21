import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, OnInit, AfterViewInit, HostListener } from '@angular/core';
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

  showFormattingToolbar = false;
  title: string = '';
  content: string = '';
  color: string = 'white';

  // Track active formatting states
  isBold = false;
  isItalic = false;
  isUnderline = false;
  isStrikethrough = false;

  @HostListener('document:selectionchange')
  onSelectionChange(): void {
    this.updateFormattingStates();
  }

  ngOnInit(): void {
    console.log('Modal received note:', this.note);
    if (this.note) {
      this.title = this.note.title || '';
      this.content = this.note.content || '';
      this.color = this.note.color || 'white';
    }
  }

  ngAfterViewInit(): void {
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
    this.updateFormattingStates();
  }

  onContentInput(event: Event): void {
    const target = event.target as HTMLElement;
    this.content = target.innerHTML;
    this.updateFormattingStates();
  }

  toggleFormattingToolbar(): void {
    this.showFormattingToolbar = !this.showFormattingToolbar;
  }

  formatText(command: string): void {
    document.execCommand(command, false, undefined);
    setTimeout(() => this.updateFormattingStates(), 10);
  }

  updateFormattingStates(): void {
    if (this.showFormattingToolbar) {
      this.isBold = document.queryCommandState('bold');
      this.isItalic = document.queryCommandState('italic');
      this.isUnderline = document.queryCommandState('underline');
      this.isStrikethrough = document.queryCommandState('strikeThrough');
    }
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
