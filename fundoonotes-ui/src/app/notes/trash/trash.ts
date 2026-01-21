import { Component, OnInit } from '@angular/core';
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

  constructor(private notesService: NotesService) {}

  ngOnInit(): void {
    this.loadTrashedNotes();
  }

  loadTrashedNotes(): void {
    this.isLoading = true;
    this.notesService.getTrashedNotes().subscribe({
      next: (notes) => {
        console.log('Trashed notes loaded:', notes); // ✅ Debug log
        this.trashedNotes = notes;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading trashed notes:', error);
        this.isLoading = false;
      }
    });
  }

  restoreNote(noteId: number): void {
    this.notesService.restoreNote(noteId).subscribe({
      next: () => {
        console.log('✅ Note restored successfully');
        this.loadTrashedNotes(); // Reload trash
      },
      error: (error) => {
        console.error('❌ Error restoring note:', error);
        alert('Failed to restore note');
      }
    });
  }

  permanentDelete(noteId: number): void {
    if (confirm('Permanently delete this note? This cannot be undone.')) {
      this.notesService.permanentDeleteNote(noteId).subscribe({
        next: () => {
          console.log('✅ Note permanently deleted');
          this.loadTrashedNotes(); // Reload trash
        },
        error: (error) => {
          console.error('❌ Error deleting note:', error);
          alert('Failed to delete note');
        }
      });
    }
  }
}
