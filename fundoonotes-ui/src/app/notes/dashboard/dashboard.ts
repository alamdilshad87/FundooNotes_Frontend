import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TakeNoteComponent } from '../take-note/take-note';
import { NoteCardComponent } from '../note-card/note-card';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TakeNoteComponent, NoteCardComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {
  notes: any[] = [];

  ngOnInit(): void {
    // TODO: Load notes from backend API
  }

  addNote(note: any): void {
    // TODO: POST to backend API
    this.notes.unshift({
      ...note,
      id: Date.now(),
      createdAt: new Date()
    });
  }

  deleteNote(id: number): void {
    // TODO: DELETE from backend API
    this.notes = this.notes.filter(note => note.id !== id);
  }

  updateNote(updatedNote: any): void {
    // TODO: PUT to backend API
    const index = this.notes.findIndex(note => note.id === updatedNote.id);
    if (index !== -1) {
      this.notes[index] = updatedNote;
    }
  }
}
