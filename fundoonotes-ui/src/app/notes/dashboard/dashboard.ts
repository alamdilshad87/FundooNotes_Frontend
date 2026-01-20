import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TakeNoteComponent } from '../take-note/take-note';
import { NoteCardComponent } from '../note-card/note-card';
import { EditNoteModalComponent } from '../edit-note-modal/edit-note-modal';
import { NotesService } from '../../core/services/notes';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TakeNoteComponent, NoteCardComponent, EditNoteModalComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {
  notes: any[] = [];
  isLoading = false;
  selectedNote: any = null;


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
        this.notes = this.notes.filter(note => note.noteId !== id);
        console.log('Note deleted successfully');
      },
      error: (error) => {
        console.error('Error deleting note:', error);
        alert('Failed to delete note. Please try again.');
      }
    });
  }


  openNoteForEdit(note: any): void {
    console.log('Opening note for edit:', note);
    this.selectedNote = { ...note };
  }


  closeEditModal(): void {
    this.selectedNote = null;
  }


  updateNote(updatedNote: any): void {
    console.log('Received updated note:', updatedNote);
    
    const payload = {
      title: updatedNote.title,
      content: updatedNote.content,
      color: updatedNote.color || 'white'
    };

    const noteId = updatedNote.noteId;

    if (!noteId) {
      console.error('❌ Note ID is missing!', updatedNote);
      alert('Cannot update note: ID is missing');
      return;
    }

    console.log('Updating note ID:', noteId);
    console.log('Payload:', payload);

    this.notesService.updateNote(noteId, payload).subscribe({
      next: (response) => {
        console.log('✅ Note updated successfully:', response);
        this.closeEditModal();
        this.loadNotes();
      },
      error: (error) => {
        console.error('❌ Error updating note:', error);
        console.error('Error details:', error.error);
        alert('Failed to update note. Please try again.');
      }
    });
  }
}
