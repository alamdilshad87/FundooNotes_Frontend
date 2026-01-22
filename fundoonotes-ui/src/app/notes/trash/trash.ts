import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoteCardComponent } from '../note-card/note-card';
import { NotesService } from '../../core/services/notes';
import { ViewModeService, ViewMode } from '../../core/services/view-mode';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-trash',
  standalone: true,
  imports: [CommonModule, NoteCardComponent],
  templateUrl: './trash.html',
  styleUrls: ['./trash.scss']
})
export class TrashComponent implements OnInit, OnDestroy {
  notes: any[] = [];
  isLoading = false;
  openColorPickerNoteId: number | null = null;
  viewMode: ViewMode = 'grid';
  private viewModeSubscription?: Subscription;

  constructor(
    private notesService: NotesService,
    private viewModeService: ViewModeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('🗑️ Trash component initialized');
    this.loadTrashedNotes();

    this.viewModeSubscription = this.viewModeService.viewMode$.subscribe(mode => {
      this.viewMode = mode;
      console.log('🗑️ Trash view mode:', mode);
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.viewModeSubscription?.unsubscribe();
  }

  loadTrashedNotes(): void {
    this.isLoading = true;
    console.log('📥 Loading trashed notes...');

    this.notesService.getTrashedNotes().subscribe({
      next: (notes) => {
        console.log('✅ Trashed notes loaded:', notes);
        this.notes = notes;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('❌ Error loading trashed notes:', error);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  restoreNote(noteId: number): void {
    console.log('♻️ Restoring note:', noteId);

    this.notes = this.notes.filter(n => n.noteId !== noteId);
    this.cdr.detectChanges();

    this.notesService.restoreNote(noteId).subscribe({
      next: () => {
        console.log('✅ Note restored');
      },
      error: (error) => {
        console.error('❌ Error restoring note:', error);
        alert('Failed to restore note');
        this.loadTrashedNotes();
      }
    });
  }

  deleteNote(noteId: number): void {
    if (!confirm('This note will be permanently deleted. Continue?')) {
      return;
    }

    console.log('💀 Permanently deleting note:', noteId);

    this.notes = this.notes.filter(n => n.noteId !== noteId);
    this.cdr.detectChanges();

    this.notesService.permanentDeleteNote(noteId).subscribe({
      next: () => {
        console.log('✅ Note permanently deleted');
      },
      error: (error) => {
        console.error('❌ Error permanently deleting note:', error);
        alert('Failed to permanently delete note');
        this.loadTrashedNotes();
      }
    });
  }

  // For note card restore button
  handleRestore(noteId: number): void {
    this.restoreNote(noteId);
  }

  handleColorPickerToggle(noteId: number): void {
    this.openColorPickerNoteId = this.openColorPickerNoteId === noteId ? null : noteId;
  }

  onSearch(query: string): void {
    console.log('🔍 Trash search:', query);
  }
}
