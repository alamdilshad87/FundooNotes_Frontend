import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TakeNoteComponent } from '../take-note/take-note';
import { NoteCardComponent } from '../note-card/note-card';
import { NotesService } from '../../core/services/notes';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TakeNoteComponent, NoteCardComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {
  notes: any[] = [];

  constructor(private notesService: NotesService) {}

  ngOnInit(): void {
    this.loadNotes();
  }

  loadNotes(): void {
    this.notesService.getNotes().subscribe({
      next: (notes) => {
        this.notes = notes;
      },
      error: (error) => {
        console.error('Error loading notes:', error);
      }
    });
  }

  addNote(note: any): void {
    this.notesService.createNote(note).subscribe({
      next: (createdNote) => {
        this.notes.unshift(createdNote);
        console.log('Note created successfully:', createdNote);
      },
      error: (error) => {
        console.error('Error creating note:', error);
      }
    });
  }

  deleteNote(id: number): void {
    this.notesService.deleteNote(id).subscribe({
      next: () => {
        this.notes = this.notes.filter(note => note.id !== id);
        console.log('Note deleted successfully');
      },
      error: (error) => {
        console.error('Error deleting note:', error);
      }
    });
  }

  updateNote(updatedNote: any): void {
    this.notesService.updateNote(updatedNote.id, updatedNote).subscribe({
      next: (note) => {
        const index = this.notes.findIndex(n => n.id === updatedNote.id);
        if (index !== -1) {
          this.notes[index] = note;
        }
        console.log('Note updated successfully:', note);
      },
      error: (error) => {
        console.error('Error updating note:', error);
      }
    });
  }
}
