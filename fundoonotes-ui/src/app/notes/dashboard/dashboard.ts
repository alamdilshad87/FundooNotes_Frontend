import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TakeNoteComponent } from '../take-note/take-note';
import { NoteCardComponent } from '../note-card/note-card';
import { EditNoteModalComponent } from '../edit-note-modal/edit-note-modal';
import { NotesService } from '../../core/services/notes';
import { ViewModeService, ViewMode } from '../../core/services/view-mode';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TakeNoteComponent, NoteCardComponent, EditNoteModalComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  allNotes: any[] = [];
  notes: any[] = [];
  pinnedNotes: any[] = [];
  unpinnedNotes: any[] = [];
  isLoading = false;
  selectedNote: any = null;
  openColorPickerNoteId: number | null = null;
  searchQuery: string = '';
  viewMode: ViewMode = 'grid'; // ✅ NEW
  private viewModeSubscription?: Subscription; // ✅ NEW

  constructor(
    private notesService: NotesService,
    private viewModeService: ViewModeService, // ✅ NEW
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadNotes();

    // ✅ Subscribe to view mode changes
    this.viewModeSubscription = this.viewModeService.viewMode$.subscribe(mode => {
      this.viewMode = mode;
      console.log('📋 Dashboard view mode:', mode);
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.viewModeSubscription?.unsubscribe();
  }

  loadNotes(): void {
    this.isLoading = true;
    this.notesService.getNotes().subscribe({
      next: (response) => {
        console.log('📥 All notes from API:', response);

        this.allNotes = response.filter(note => {
          const isDeleted = note.isDeleted ?? note.IsDeleted ?? false;
          const isArchived = note.isArchived ?? note.IsArchived ?? false;
          return !isDeleted && !isArchived;
        });

        this.applyFilters();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('❌ Error loading notes:', error);
        this.isLoading = false;
      }
    });
  }

  onSearch(query: string): void {
    console.log('🔍 Dashboard search called with:', query);
    this.searchQuery = query.toLowerCase().trim();
    this.applyFilters();
  }

  private applyFilters(): void {
    if (this.searchQuery) {
      this.notes = this.allNotes.filter(note => {
        const titleMatch = note.title?.toLowerCase().includes(this.searchQuery);
        const contentMatch = note.content?.toLowerCase().includes(this.searchQuery);
        const labelsMatch = note.labels?.some((label: string) =>
          label.toLowerCase().includes(this.searchQuery)
        );
        return titleMatch || contentMatch || labelsMatch;
      });
    } else {
      this.notes = [...this.allNotes];
    }

    this.separateNotes();
  }

  private separateNotes(): void {
    const pinned = this.notes.filter(note => note.isPinned);
    const unpinned = this.notes.filter(note => !note.isPinned);

    this.pinnedNotes = pinned.sort((a, b) => {
      const dateA = new Date(a.updatedAt || a.createdAt).getTime();
      const dateB = new Date(b.updatedAt || b.createdAt).getTime();
      return dateB - dateA;
    });

    this.unpinnedNotes = unpinned.sort((a, b) => {
      const dateA = new Date(a.updatedAt || a.createdAt).getTime();
      const dateB = new Date(b.updatedAt || b.createdAt).getTime();
      return dateB - dateA;
    });

    console.log('📌 Pinned:', this.pinnedNotes.length, '📝 Unpinned:', this.unpinnedNotes.length);
  }

  addNote(noteData: any): void {
    console.log('🎯 DASHBOARD addNote called with:', noteData);

    this.notesService.createNote(noteData).subscribe({
      next: (response) => {
        console.log('✅ Note created response:', response);
        this.loadNotes();
      },
      error: (error) => {
        console.error('❌ Error creating note:', error);
        alert('Failed to create note. Please try again.');
      }
    });
  }

  deleteNote(id: number): void {
    this.notes = this.notes.filter(note => note.noteId !== id);
    this.allNotes = this.allNotes.filter(note => note.noteId !== id);
    this.separateNotes();
    this.cdr.detectChanges();

    this.notesService.deleteNote(id).subscribe({
      next: () => {
        console.log('✅ Note moved to trash');
      },
      error: (error) => {
        console.error('❌ Error moving note to trash:', error);
        alert('Failed to move note to trash. Please try again.');
        this.loadNotes();
      }
    });
  }

  archiveNote(id: number): void {
    console.log('📦 Archiving note:', id);

    this.notes = this.notes.filter(note => note.noteId !== id);
    this.allNotes = this.allNotes.filter(note => note.noteId !== id);
    this.separateNotes();
    this.cdr.detectChanges();

    this.notesService.toggleArchive(id).subscribe({
      next: () => {
        console.log('✅ Note archived successfully');
      },
      error: (error) => {
        console.error('❌ Error archiving note:', error);
        alert('Failed to archive note. Please try again.');
        this.loadNotes();
      }
    });
  }

  togglePin(id: number): void {
    console.log('📌 Toggling pin for note:', id);

    const note = this.notes.find(n => n.noteId === id);
    if (note) {
      note.isPinned = !note.isPinned;
      note.updatedAt = new Date().toISOString();
      this.separateNotes();
      this.cdr.detectChanges();
    }

    this.notesService.togglePin(id).subscribe({
      next: () => {
        console.log('✅ Pin toggled successfully');
      },
      error: (error) => {
        console.error('❌ Error toggling pin:', error);
        alert('Failed to toggle pin. Please try again.');
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
      color: updatedNote.color || 'white',
      isPinned: updatedNote.isPinned
    };

    const noteId = updatedNote.noteId;

    if (!noteId) {
      console.error('❌ Note ID is missing!');
      alert('Cannot update note: ID is missing');
      return;
    }

    const note = this.notes.find(n => n.noteId === noteId);
    if (note) {
      note.title = updatedNote.title;
      note.content = updatedNote.content;
      note.color = updatedNote.color;
      note.isPinned = updatedNote.isPinned;
      note.updatedAt = new Date().toISOString();
      this.separateNotes();
      this.cdr.detectChanges();
    }

    this.notesService.updateNote(noteId, payload).subscribe({
      next: (response) => {
        console.log('✅ Note updated successfully:', response);
      },
      error: (error) => {
        console.error('❌ Error updating note:', error);
        alert('Failed to update note. Please try again.');
        this.loadNotes();
      }
    });
  }

  updateNoteColor(event: {noteId: number, color: string}): void {
    const noteToUpdate = this.notes.find(n => n.noteId === event.noteId);

    if (!noteToUpdate) {
      console.error('❌ Note not found');
      return;
    }

    const oldColor = noteToUpdate.color;
    noteToUpdate.color = event.color;
    this.cdr.detectChanges();

    const payload = {
      title: noteToUpdate.title,
      content: noteToUpdate.content,
      color: event.color
    };

    this.notesService.updateNote(event.noteId, payload).subscribe({
      next: (response) => {
        console.log('✅ Color updated successfully');
      },
      error: (error) => {
        console.error('❌ Error updating color:', error);
        alert('Failed to update note color. Please try again.');
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
