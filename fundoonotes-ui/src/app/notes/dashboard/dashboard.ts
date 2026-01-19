import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TakeNoteComponent } from '../take-note/take-note';
import { NoteCardComponent } from '../note-card/note-card';
import { NotesService } from '../../core/services/notes';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    TakeNoteComponent,
    NoteCardComponent
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {

  notes: any[] = [];

  constructor(private notesService: NotesService) {}

  ngOnInit(): void {
    this.notesService.getNotes().subscribe({
      next: (res) => this.notes = res,
      error: (err) => console.error('Failed to load notes', err)
    });
  }

  addNote(note: any): void {
    this.notes.unshift(note);
  }
}
