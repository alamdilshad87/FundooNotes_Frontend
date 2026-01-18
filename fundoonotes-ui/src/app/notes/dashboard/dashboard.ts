import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoteInputComponent, NoteDraft } from '../note-input/note-input';
import { NoteCardComponent, Note } from '../note-card/note-card';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NoteInputComponent,
    NoteCardComponent
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class DashboardComponent {
  notes: Note[] = [];
  private nextId = 1;

  addNote(draft: NoteDraft): void {
    this.notes.unshift({
      id: this.nextId++,
      title: draft.title,
      content: draft.content,
    });
  }
}
