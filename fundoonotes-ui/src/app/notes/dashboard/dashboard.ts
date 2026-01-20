import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  isLoading = false;

  constructor(
    private notesService: NotesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadNotes();
  }

  loadNotes(): void {
    this.isLoading = true;
    this.notesService.getNotes().subscribe({
      next: (response) => {
        console.log('Notes loaded:', response);
        this.notes = response;
        this.isLoading = false;
        // Force Angular to detect changes
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading notes:', error);
        this.isLoading = false;
      }
    });
  }

  addNote(noteData: any): void {
    this.notesService.createNote(noteData).subscribe({
      next: (response) => {
        console.log('Note created successfully:', response.message);
        this.loadNotes();
      },
      error: (error) => {
        console.error('Error creating note:', error);
        alert('Failed to create note. Please try again.');
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
        alert('Failed to delete note. Please try again.');
      }
    });
  }

  updateNote(updatedNote: any): void {
    this.notesService.updateNote(updatedNote.id, updatedNote).subscribe({
      next: (response) => {
        console.log('Note updated successfully');
        this.loadNotes();
      },
      error: (error) => {
        console.error('Error updating note:', error);
        alert('Failed to update note. Please try again.');
      }
    });
  }
}