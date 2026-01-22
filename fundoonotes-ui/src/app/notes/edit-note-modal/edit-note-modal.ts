import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-note-modal',
  standalone: true,
  imports: [CommonModule],
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

  ngOnInit(): void {
    if (this.note) {
      this.title = this.note.title || '';
      this.content = this.note.content || '';
      this.color = this.note.color || '#ffffff';
      this.isPinned = this.note.isPinned || false;
    }
  }

  ngAfterViewInit(): void {
    if (this.titleEditor && this.title) {
      this.titleEditor.nativeElement.textContent = this.title;
    }
    if (this.contentEditor && this.content) {
      this.contentEditor.nativeElement.textContent = this.content;
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

  togglePin(event: Event): void {
    event.stopPropagation();
    this.isPinned = !this.isPinned;
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === this.modalBackdrop.nativeElement) {
      this.saveAndClose();
    }
  }

  saveAndClose(): void {
    if (this.title !== this.note.title || this.content !== this.note.content ||
        this.color !== this.note.color || this.isPinned !== this.note.isPinned) {
      const updatedNote = {
        noteId: this.note.noteId,
        title: this.title,
        content: this.content,
        color: this.color,
        isPinned: this.isPinned
      };
      this.save.emit(updatedNote);
    }
    this.close.emit();
  }

  handleClose(): void {
    this.saveAndClose();
  }

  getBackgroundStyle(): any {
    return { 'background-color': this.color };
  }
}
