import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoteCardComponent } from '../note-card/note-card';
import { EditNoteModalComponent } from '../edit-note-modal/edit-note-modal';
import { NotesService } from '../../core/services/notes';
import { ViewModeService, ViewMode } from '../../core/services/view-mode';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-archive',
  standalone: true,
  imports: [CommonModule, NoteCardComponent, EditNoteModalComponent],
  templateUrl: './archive.html',
  styleUrls: ['./archive.scss']
})
export class ArchiveComponent implements OnInit, OnDestroy {
  notes: any[] = [];
  isLoading = false;
  selectedNote: any = null;
  openColorPickerNoteId: number | null = null;
  viewMode: ViewMode = 'grid';
  private viewModeSubscription?: Subscription;

  constructor(
    private notesService: NotesService,
    private viewModeService: ViewModeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadArchivedNotes();

    this.viewModeSubscription = this.viewModeService.viewMode$.subscribe(mode => {
      this.viewMode = mode;
      console.log('📦 Archive view mode:', mode);
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.viewModeSubscription?.unsubscribe();
  }

  loadArchivedNotes(): void {
    this.isLoading = true;
    console.log('📥 Loading archived notes...');

    this.notesService.getArchivedNotes().subscribe({
      next: (notes) => {
        console.log('✅ Archived notes loaded:', notes);
        this.notes = notes;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('❌ Error loading archived notes:', error);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  unarchiveNote(noteId: number): void {
    console.log('📤 Unarchiving note:', noteId);

    // Optimistic update
    this.notes = this.notes.filter(n => n.noteId !== noteId);
    this.cdr.detectChanges();

    this.notesService.toggleArchive(noteId).subscribe({
      next: () => {
        console.log('✅ Note unarchived');
      },
      error: (error) => {
        console.error('❌ Error unarchiving note:', error);
        alert('Failed to unarchive note');
        this.loadArchivedNotes();
      }
    });
  }

  deleteNote(noteId: number): void {
    console.log('🗑️ Deleting note:', noteId);

    // Optimistic update
    this.notes = this.notes.filter(n => n.noteId !== noteId);
    this.cdr.detectChanges();

    this.notesService.deleteNote(noteId).subscribe({
      next: () => {
        console.log('✅ Note deleted');
      },
      error: (error) => {
        console.error('❌ Error deleting note:', error);
        alert('Failed to delete note');
        this.loadArchivedNotes();
      }
    });
  }

  togglePin(noteId: number): void {
    console.log('📌 Toggling pin:', noteId);

    const note = this.notes.find(n => n.noteId === noteId);
    if (note) {
      note.isPinned = !note.isPinned;
      this.cdr.detectChanges();
    }

    this.notesService.togglePin(noteId).subscribe({
      next: () => {
        console.log('✅ Pin toggled');
      },
      error: (error) => {
        console.error('❌ Error toggling pin:', error);
        if (note) {
          note.isPinned = !note.isPinned;
          this.cdr.detectChanges();
        }
      }
    });
  }

  openNoteForEdit(note: any): void {
    console.log('📝 Opening note for edit:', note);
    this.selectedNote = { ...note };
  }

  closeEditModal(): void {
    this.selectedNote = null;
  }

  updateNote(updatedNote: any): void {
    const payload = {
      title: updatedNote.title,
      content: updatedNote.content,
      color: updatedNote.color || 'white',
      isPinned: updatedNote.isPinned
    };

    const noteId = updatedNote.noteId;

    if (!noteId) {
      console.error('❌ Note ID is missing!');
      return;
    }

    const note = this.notes.find(n => n.noteId === noteId);
    if (note) {
      note.title = updatedNote.title;
      note.content = updatedNote.content;
      note.color = updatedNote.color;
      note.isPinned = updatedNote.isPinned;
      this.cdr.detectChanges();
    }

    this.notesService.updateNote(noteId, payload).subscribe({
      next: () => {
        console.log('✅ Note updated');
      },
      error: (error) => {
        console.error('❌ Error updating note:', error);
        alert('Failed to update note');
        this.loadArchivedNotes();
      }
    });
  }

  updateNoteColor(event: {noteId: number, color: string}): void {
    const note = this.notes.find(n => n.noteId === event.noteId);
    if (!note) return;

    const oldColor = note.color;
    note.color = event.color;
    this.cdr.detectChanges();

    const payload = {
      title: note.title,
      content: note.content,
      color: event.color
    };

    this.notesService.updateNote(event.noteId, payload).subscribe({
      next: () => {
        console.log('✅ Color updated');
      },
      error: (error) => {
        console.error('❌ Error updating color:', error);
        note.color = oldColor;
        this.cdr.detectChanges();
      }
    });
  }

  handleColorPickerToggle(noteId: number): void {
    this.openColorPickerNoteId = this.openColorPickerNoteId === noteId ? null : noteId;
  }

  // ✅ For search functionality
  onSearch(query: string): void {
    console.log('🔍 Archive search:', query);
    // Implement search if needed
  }
}
