import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime } from 'rxjs';
import { NotesService } from '../../core/services/notes';

@Component({
  selector: 'app-take-note',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './take-note.html',
  styleUrls: ['./take-note.scss']
})
export class TakeNoteComponent {

  title = '';
  description = '';
  expanded = false;

  private autosave$ = new Subject<void>();

  @Output() noteSaved = new EventEmitter<any>();

  constructor(private notesService: NotesService) {
    this.autosave$
      .pipe(debounceTime(800))
      .subscribe(() => this.save());
  }

  onInput(): void {
    this.expanded = true;
    this.autosave$.next();
  }

  onBlur(): void {
    this.save();
  }

  noteId: number | null = null;

  private save(): void {
    if (!this.title.trim() && !this.description.trim()) return;

    const payload = {
      title: this.title,
      content: this.description,
      color: 'white'
    };

    if (this.noteId === null) {
      // FIRST SAVE → CREATE
      this.notesService.createNote(payload).subscribe(note => {
        this.noteId = note.id;
        this.noteSaved.emit(note);
      });
    } else {
      // AUTOSAVE → UPDATE
      this.notesService.updateNote(this.noteId, payload).subscribe();
    }
}



  private reset(): void {
    this.title = '';
    this.description = '';
    this.expanded = false;
  }
}
