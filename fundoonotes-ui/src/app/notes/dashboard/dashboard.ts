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
  pinnedNotes: any[] = [];
  unpinnedNotes: any[] = [];
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

        this.notes = response.filter(note => {
          const isDeleted = note.isDeleted ?? note.IsDeleted ?? false;
          const isArchived = note.isArchived ?? note.IsArchived ?? false;
          return !isDeleted && !isArchived;
        });

        this.separateNotes();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('❌ Error loading notes:', error);
        this.isLoading = false;
      }
    });
  }

  // ✅ Sort pinned notes (newest first) and unpinned notes (newest first)
  private separateNotes(): void {
    // Separate pinned and unpinned
    const pinned = this.notes.filter(note => note.isPinned);
    const unpinned = this.notes.filter(note => !note.isPinned);

    // ✅ Sort pinned notes by updatedAt (NEWEST FIRST - most recently pinned at top)
    this.pinnedNotes = pinned.sort((a, b) => {
      const dateA = new Date(a.updatedAt || a.createdAt).getTime();
      const dateB = new Date(b.updatedAt || b.createdAt).getTime();
      return dateB - dateA; // Descending order (newest first)
    });

    // Sort unpinned notes by updatedAt (newest first)
    this.unpinnedNotes = unpinned.sort((a, b) => {
      const dateA = new Date(a.updatedAt || a.createdAt).getTime();
      const dateB = new Date(b.updatedAt || b.createdAt).getTime();
      return dateB - dateA; // Descending order (newest first)
    });

    console.log('📌 Pinned:', this.pinnedNotes.length, '📝 Unpinned:', this.unpinnedNotes.length);
  }

  addNote(noteData: any): void {
  console.log('🎯 DASHBOARD addNote called with:', noteData);
  console.log('📌 isPinned:', noteData.isPinned);

  this.notesService.createNote(noteData).subscribe({
    next: (response) => {
      console.log('✅ Note created response:', response);

      // ✅ FIX: Reload notes to get proper data from backend
      this.loadNotes();
    },
    error: (error) => {
      console.error('❌ Error creating note:', error);
      alert('Failed to create note. Please try again.');
    }
  });
}


  deleteNote(id: number): void {
    // Optimistic update - remove from UI immediately
    this.notes = this.notes.filter(note => note.noteId !== id);
    this.separateNotes();
    this.cdr.detectChanges();

    // Then call backend
    this.notesService.deleteNote(id).subscribe({
      next: () => {
        console.log('✅ Note moved to trash');
      },
      error: (error) => {
        console.error('❌ Error moving note to trash:', error);
        alert('Failed to move note to trash. Please try again.');
        this.loadNotes(); // Reload on error to restore state
      }
    });
  }

  archiveNote(id: number): void {
    console.log('📦 Archiving note:', id);

    // Optimistic update - remove from UI immediately
    this.notes = this.notes.filter(note => note.noteId !== id);
    this.separateNotes();
    this.cdr.detectChanges();

    // Then call backend
    this.notesService.toggleArchive(id).subscribe({
      next: () => {
        console.log('✅ Note archived successfully');
      },
      error: (error) => {
        console.error('❌ Error archiving note:', error);
        alert('Failed to archive note. Please try again.');
        this.loadNotes(); // Reload on error to restore state
      }
    });
  }

  togglePin(id: number): void {
    console.log('📌 Toggling pin for note:', id);

    // Optimistic update - toggle immediately in UI
    const note = this.notes.find(n => n.noteId === id);
    if (note) {
      note.isPinned = !note.isPinned;
      note.updatedAt = new Date().toISOString(); // Update timestamp for proper sorting
      this.separateNotes(); // Re-separate and sort
      this.cdr.detectChanges();
    }

    // Then call backend
    this.notesService.togglePin(id).subscribe({
      next: () => {
        console.log('✅ Pin toggled successfully');
      },
      error: (error) => {
        console.error('❌ Error toggling pin:', error);
        alert('Failed to toggle pin. Please try again.');
        // Revert optimistic update on error
        if (note) {
          note.isPinned = !note.isPinned;
          this.separateNotes();
          this.cdr.detectChanges();
        }
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
    const payload = {
      title: updatedNote.title,
      content: updatedNote.content,
      color: updatedNote.color || 'white'
    };

    const noteId = updatedNote.noteId;

    if (!noteId) {
      console.error('❌ Note ID is missing!');
      alert('Cannot update note: ID is missing');
      return;
    }

    this.notesService.updateNote(noteId, payload).subscribe({
      next: (response) => {
        console.log('✅ Note updated successfully:', response);

        // Update local note immediately
        const note = this.notes.find(n => n.noteId === noteId);
        if (note) {
          note.title = updatedNote.title;
          note.content = updatedNote.content;
          note.color = updatedNote.color;
          note.updatedAt = new Date().toISOString(); // Update timestamp
          this.separateNotes(); // Re-sort after update
          this.cdr.detectChanges();
        }

        this.closeEditModal();
      },
      error: (error) => {
        console.error('❌ Error updating note:', error);
        alert('Failed to update note. Please try again.');
      }
    });
  }

  updateNoteColor(event: {noteId: number, color: string}): void {
    const noteToUpdate = this.notes.find(n => n.noteId === event.noteId);

    if (!noteToUpdate) {
      console.error('❌ Note not found');
      return;
    }

    // Optimistic update - change color immediately
    const oldColor = noteToUpdate.color;
    noteToUpdate.color = event.color;
    this.cdr.detectChanges();

    const payload = {
      title: noteToUpdate.title,
      content: noteToUpdate.content,
      color: event.color
    };

    // Then call backend
    this.notesService.updateNote(event.noteId, payload).subscribe({
      next: (response) => {
        console.log('✅ Color updated successfully');
      },
      error: (error) => {
        console.error('❌ Error updating color:', error);
        alert('Failed to update note color. Please try again.');
        // Revert on error
        noteToUpdate.color = oldColor;
        this.cdr.detectChanges();
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
