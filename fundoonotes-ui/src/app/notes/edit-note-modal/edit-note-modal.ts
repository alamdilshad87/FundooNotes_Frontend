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
  showColorPicker = false;
  title: string = '';
  content: string = '';
  color: string = 'transparent';
  isPinned: boolean = false;

  // Track active formatting states
  isBold = false;
  isItalic = false;
  isUnderline = false;
  isStrikethrough = false;

  // Color palette matching Google Keep
  solidColors = [
    { name: 'Default', value: 'transparent' },
    { name: 'Coral', value: '#f28b82' },
    { name: 'Peach', value: '#fbbc04' },
    { name: 'Sand', value: '#fff475' },
    { name: 'Mint', value: '#ccff90' },
    { name: 'Sage', value: '#a7ffeb' },
    { name: 'Fog', value: '#cbf0f8' },
    { name: 'Storm', value: '#aecbfa' },
    { name: 'Dusk', value: '#d7aefb' },
    { name: 'Blossom', value: '#fdcfe8' },
    { name: 'Clay', value: '#e6c9a8' },
    { name: 'Chalk', value: '#e8eaed' }
  ];

  @HostListener('document:selectionchange')
  onSelectionChange(): void {
    this.updateFormattingStates();
  }

  ngOnInit(): void {
    console.log('Modal received note:', this.note);
    if (this.note) {
      this.title = this.note.title;
      this.content = this.note.content;
      this.color = this.note.color || 'transparent';
      this.isPinned = this.note.isPinned || false;
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

  togglePin(event: Event): void {
    event.stopPropagation();
    this.isPinned = !this.isPinned;
    console.log('Pin toggled in edit modal:', this.isPinned);
  }

  toggleFormattingToolbar(): void {
    this.showFormattingToolbar = !this.showFormattingToolbar;
    if (this.showFormattingToolbar) {
      this.showColorPicker = false;
    }
  }

  toggleColorPicker(event: Event): void {
    event.stopPropagation();
    this.showColorPicker = !this.showColorPicker;
    if (this.showColorPicker) {
      this.showFormattingToolbar = false;
    }
  }

  selectColor(colorValue: string, event: Event): void {
    event.stopPropagation();
    this.color = colorValue;
    this.showColorPicker = false;
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

  // ✅ FIXED - Close modal immediately after emitting save
  saveAndClose(): void {
    const hasChanges =
      this.title !== this.note.title ||
      this.content !== this.note.content ||
      this.color !== this.note.color ||
      this.isPinned !== this.note.isPinned;

    if (hasChanges) {
      const updatedNote = {
        noteId: this.note.noteId,
        title: this.title,
        content: this.content,
        color: this.color,
        isPinned: this.isPinned
      };
      console.log('✅ Saving and closing - updated note:', updatedNote);
      this.save.emit(updatedNote);
    } else {
      console.log('ℹ️ No changes detected');
    }

    // ✅ ALWAYS CLOSE THE MODAL IMMEDIATELY
    this.close.emit();
  }

  handleClose(): void {
    this.saveAndClose();
  }

  getBackgroundStyle(): any {
    return {
      'background-color': this.color === 'transparent' ? '#ffffff' : this.color
    };
  }
}
