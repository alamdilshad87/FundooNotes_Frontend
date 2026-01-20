import { Component, EventEmitter, Output, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-take-note',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './take-note.html',
  styleUrls: ['./take-note.scss'],
  host: {
    '(document:click)': 'onClickOutside($event)'
  }
})
export class TakeNoteComponent implements AfterViewInit {
  @Output() save = new EventEmitter<{ title: string; content: string }>();
  
  @ViewChild('titleInput') titleInput?: ElementRef<HTMLInputElement>;
  @ViewChild('contentInput') contentInput?: ElementRef<HTMLTextAreaElement>;

  isExpanded = false;
  showFormatting = false;
  title = '';
  content = '';

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit(): void {
    if (this.contentInput) {
      this.contentInput.nativeElement.addEventListener('input', () => {
        this.autoResize();
      });
    }
  }

  expand(): void {
    this.isExpanded = true;
    setTimeout(() => {
      this.contentInput?.nativeElement.focus();
      this.autoResize();
    }, 0);
  }

  toggleFormatting(): void {
    this.showFormatting = !this.showFormatting;
  }

  applyFormat(format: string): void {
    // TODO: Implement actual text formatting logic
    console.log('Apply format:', format);
    // This is where you'd implement the formatting logic
    // For now, it's a placeholder
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

  onClickOutside(event: MouseEvent): void {
    if (this.isExpanded && !this.elementRef.nativeElement.contains(event.target)) {
      this.close();
    }
  }

  private autoResize(): void {
    const textarea = this.contentInput?.nativeElement;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }

  private reset(): void {
    this.isExpanded = false;
    this.showFormatting = false;
    this.title = '';
    this.content = '';
    
    if (this.contentInput) {
      this.contentInput.nativeElement.style.height = 'auto';
    }
  }
}
