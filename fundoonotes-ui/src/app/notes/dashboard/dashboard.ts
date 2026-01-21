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
  openColorPickerNoteId: number | null = null;

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
        console.log('📥 All notes from API:', response);
        console.log('📊 Total notes:', response.length);

        this.notes = response.filter(note => {
          const isDeleted = note.isDeleted ?? note.IsDeleted ?? false;
          const isArchived = note.isArchived ?? note.IsArchived ?? false;

          console.log(`Note ${note.noteId}: isDeleted=${isDeleted}, isArchived=${isArchived}`);

          return !isDeleted && !isArchived;
        });

        console.log('✅ Active notes after filtering:', this.notes);
        console.log('✅ Active notes count:', this.notes.length);

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('❌ Error loading notes:', error);
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
        console.log('✅ Note moved to trash');
        this.notes = this.notes.filter(note => note.noteId !== id);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('❌ Error moving note to trash:', error);
        alert('Failed to move note to trash. Please try again.');
      }
    });
  }

  // ✅ ADD THIS METHOD
  archiveNote(id: number): void {
    console.log('📦 Archiving note:', id);
    this.notesService.toggleArchive(id).subscribe({
      next: () => {
        console.log('✅ Note archived successfully');
        // Remove from current view
        this.notes = this.notes.filter(note => note.noteId !== id);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('❌ Error archiving note:', error);
        alert('Failed to archive note. Please try again.');
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

  updateNoteColor(event: {noteId: number, color: string}): void {
    console.log('🎨 Updating note color:', event);

    const noteToUpdate = this.notes.find(n => n.noteId === event.noteId);

    if (!noteToUpdate) {
      console.error('❌ Note not found');
      return;
    }

    const payload = {
      title: noteToUpdate.title,
      content: noteToUpdate.content,
      color: event.color
    };

    console.log('📤 Sending payload:', payload);

    this.notesService.updateNote(event.noteId, payload).subscribe({
      next: (response) => {
        console.log('✅ Color updated successfully:', response);
        const note = this.notes.find(n => n.noteId === event.noteId);
        if (note) {
          note.color = event.color;
          console.log('✅ Local note updated with color:', note.color);
        }
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('❌ Error updating color:', error);
        alert('Failed to update note color. Please try again.');
      }
    });
  }

  handleColorPickerToggle(noteId: number): void {
    if (this.openColorPickerNoteId === noteId) {
      this.openColorPickerNoteId = null;
    } else {
      this.openColorPickerNoteId = noteId;
    }
  }
}
