import { Component, Output, EventEmitter, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-take-note',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './take-note.html',
  styleUrls: ['./take-note.scss']
})
export class TakeNoteComponent {
  @Output() save = new EventEmitter<any>();
  @ViewChild('titleEditor') titleEditor!: ElementRef;
  @ViewChild('contentEditor') contentEditor!: ElementRef;
  @ViewChild('noteContainer') noteContainer!: ElementRef;

  isExpanded = false;
  showColorPicker = false;
  title: string = '';
  content: string = '';
  color: string = '#ffffff';
  isPinned: boolean = false;

  solidColors = [
    { name: 'Default', value: '#ffffff' },
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

  expand(): void {
    this.isExpanded = true;
  }

  close(): void {
    if (this.title.trim() || this.content.trim()) {
      this.saveNote();
    }
    this.isExpanded = false;
    this.showColorPicker = false;
  }

  saveNote(): void {
    const noteData = {
      title: this.title.trim(),
      content: this.content.trim(),
      color: this.color,
      isPinned: this.isPinned,
      isArchived: false
    };

    if (noteData.title || noteData.content) {
      this.save.emit(noteData);
      this.resetForm();
    }
  }

  togglePin(event: Event): void {
    event.stopPropagation();
    this.isPinned = !this.isPinned;
  }

  archiveNote(event: Event): void {
    event.stopPropagation();
    if (!this.title.trim() && !this.content.trim()) return;

    const noteData = {
      title: this.title.trim(),
      content: this.content.trim(),
      color: this.color,
      isPinned: false,
      isArchived: true
    };

    this.save.emit(noteData);
    this.resetForm();
    this.isExpanded = false;
  }

  resetForm(): void {
    this.title = '';
    this.content = '';
    this.color = '#ffffff';
    this.isPinned = false;

    if (this.titleEditor) {
      this.titleEditor.nativeElement.textContent = '';
    }
    if (this.contentEditor) {
      this.contentEditor.nativeElement.textContent = '';
    }
  }

  onTitleInput(event: Event): void {
    const target = event.target as HTMLElement;
    this.title = target.textContent || '';
  }

  onContentInput(event: Event): void {
    const target = event.target as HTMLElement;
    this.content = target.textContent || '';
  }

  toggleColorPicker(event: Event): void {
    event.stopPropagation();
    this.showColorPicker = !this.showColorPicker;
  }

  selectColor(colorValue: string, event: Event): void {
    event.stopPropagation();
    this.color = colorValue;
    this.showColorPicker = false;
  }

  getBackgroundStyle(): any {
    return { 'background-color': this.color };
  }
}
