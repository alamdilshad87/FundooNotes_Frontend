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
  showFormattingToolbar = false;
  showColorPicker = false;
  title: string = '';
  content: string = '';
  color: string = 'transparent';

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

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.isExpanded && this.noteContainer) {
      const clickedInside = this.noteContainer.nativeElement.contains(event.target);
      if (!clickedInside) {
        this.close();
      }
    }
  }

  @HostListener('document:selectionchange')
  onSelectionChange(): void {
    this.updateFormattingStates();
  }

  expand(): void {
    this.isExpanded = true;
  }

  close(): void {
    if (this.title.trim() || this.content.trim()) {
      this.saveNote();
    }
    this.isExpanded = false;
    this.showFormattingToolbar = false;
    this.showColorPicker = false;
  }

  saveNote(): void {
    const noteData = {
      title: this.title.trim(),
      content: this.content.trim(),
      color: this.color,
      isArchived: false // ✅ Normal note
    };

    if (noteData.title || noteData.content) {
      console.log('📝 Saving normal note:', noteData);
      this.save.emit(noteData);
      this.resetForm();
    }
  }

  // ✅ ADD THIS METHOD - Archive Note
  archiveNote(event: Event): void {
    event.stopPropagation();

    console.log('📦 Archive button clicked!');
    console.log('📦 Title:', this.title);
    console.log('📦 Content:', this.content);

    if (!this.title.trim() && !this.content.trim()) {
      console.log('⚠️ Empty note - not archiving');
      return;
    }

    const noteData = {
      title: this.title.trim(),
      content: this.content.trim(),
      color: this.color,
      isArchived: true // ✅ Archived note
    };

    console.log('📦 Emitting archived note:', noteData);
    this.save.emit(noteData);
    this.resetForm();
    this.isExpanded = false;
  }

  resetForm(): void {
    this.title = '';
    this.content = '';
    this.color = 'transparent';

    if (this.titleEditor) {
      this.titleEditor.nativeElement.innerHTML = '';
    }
    if (this.contentEditor) {
      this.contentEditor.nativeElement.innerHTML = '';
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
    if (this.isExpanded && this.showFormattingToolbar) {
      this.isBold = document.queryCommandState('bold');
      this.isItalic = document.queryCommandState('italic');
      this.isUnderline = document.queryCommandState('underline');
      this.isStrikethrough = document.queryCommandState('strikeThrough');
    }
  }

  getBackgroundStyle(): any {
    return { 'background-color': this.color };
  }
}
