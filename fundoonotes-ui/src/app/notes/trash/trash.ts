import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotesService } from '../../core/services/notes';

@Component({
  selector: 'app-trash',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trash.html',
  styleUrls: ['./trash.scss']
})
export class TrashComponent implements OnInit {
  trashedNotes: any[] = [];
  isLoading = false;

  constructor(
    private notesService: NotesService,
    private cdr: ChangeDetectorRef  // ✅ ADD THIS
  ) {
    console.log('🗑️ TrashComponent constructor');
  }

  ngOnInit(): void {
    console.log('🗑️ TrashComponent ngOnInit');
    this.loadTrashedNotes();
  }

  loadTrashedNotes(): void {
    console.log('📍 Starting to load trashed notes...');
    this.isLoading = true;
    this.cdr.detectChanges(); // ✅ ADD THIS

    this.notesService.getTrashedNotes().subscribe({
      next: (notes) => {
        console.log('✅ Trashed notes received:', notes);
        console.log('✅ Number of notes:', notes.length);

        this.trashedNotes = notes;
        this.isLoading = false;
        this.cdr.detectChanges(); // ✅ ADD THIS

        console.log('✅ After update - isLoading:', this.isLoading);
        console.log('✅ After update - trashedNotes.length:', this.trashedNotes.length);
      },
      error: (error) => {
        console.error('❌ Error loading trashed notes:', error);
        this.isLoading = false;
        this.cdr.detectChanges(); // ✅ ADD THIS
      }
    });
  }

  restoreNote(noteId: number): void {
    console.log('🔄 Restoring note:', noteId);
    this.notesService.restoreNote(noteId).subscribe({
      next: (response) => {
        console.log('✅ Note restored:', response);
        this.loadTrashedNotes();
      },
      error: (error) => {
        console.error('❌ Error restoring note:', error);
        alert('Failed to restore note');
      }
    });
  }

  permanentDelete(noteId: number): void {
    if (confirm('Permanently delete this note? This cannot be undone.')) {
      console.log('🗑️ Permanently deleting note:', noteId);
      this.notesService.permanentDeleteNote(noteId).subscribe({
        next: (response) => {
          console.log('✅ Note permanently deleted:', response);
          this.loadTrashedNotes();
        },
        error: (error) => {
          console.error('❌ Error deleting note:', error);
          alert('Failed to delete note');
        }
      });
    }
  }
}
