import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotesService } from '../../core/services/notes';

@Component({
  selector: 'app-archive',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './archive.html',
  styleUrls: ['./archive.scss']
})
export class ArchiveComponent implements OnInit {
  archivedNotes: any[] = [];
  isLoading = false;

  constructor(
    private notesService: NotesService,
    private cdr: ChangeDetectorRef  // ✅ ADD THIS
  ) {
    console.log('📦 ArchiveComponent constructor');
  }

  ngOnInit(): void {
    console.log('📦 ArchiveComponent ngOnInit');
    this.loadArchivedNotes();
  }

  loadArchivedNotes(): void {
    console.log('📍 Starting to load archived notes...');
    this.isLoading = true;
    this.cdr.detectChanges(); // ✅ ADD THIS

    this.notesService.getArchivedNotes().subscribe({
      next: (notes) => {
        console.log('✅ Archived notes received:', notes);
        console.log('✅ Number of notes:', notes.length);
        console.log('✅ First note:', notes[0]);

        this.archivedNotes = notes;
        this.isLoading = false;
        this.cdr.detectChanges(); // ✅ ADD THIS

        console.log('✅ After update - isLoading:', this.isLoading);
        console.log('✅ After update - archivedNotes.length:', this.archivedNotes.length);
      },
      error: (error) => {
        console.error('❌ Error loading archived notes:', error);
        this.isLoading = false;
        this.cdr.detectChanges(); // ✅ ADD THIS
      }
    });
  }

  unarchiveNote(noteId: number): void {
    console.log('📤 Unarchiving note:', noteId);
    this.notesService.toggleArchive(noteId).subscribe({
      next: () => {
        console.log('✅ Note unarchived successfully');
        this.loadArchivedNotes();
      },
      error: (error) => {
        console.error('❌ Error unarchiving note:', error);
        alert('Failed to unarchive note');
      }
    });
  }

  deleteNote(noteId: number): void {
    console.log('🗑️ Moving archived note to trash:', noteId);
    this.notesService.deleteNote(noteId).subscribe({
      next: () => {
        console.log('✅ Note moved to trash');
        this.loadArchivedNotes();
      },
      error: (error) => {
        console.error('❌ Error deleting note:', error);
        alert('Failed to delete note');
      }
    });
  }
}
