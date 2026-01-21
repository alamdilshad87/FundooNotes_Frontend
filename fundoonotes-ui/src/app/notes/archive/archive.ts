import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotesService } from '../../core/services/notes';
import { NoteCardComponent } from '../note-card/note-card';

@Component({
  selector: 'app-archive',
  standalone: true,
  imports: [CommonModule, NoteCardComponent],
  templateUrl: './archive.html',
  styleUrls: ['./archive.scss']
})
export class ArchiveComponent implements OnInit {
  archivedNotes: any[] = [];
  isLoading = false;

  constructor(private notesService: NotesService) {}

  ngOnInit(): void {
    this.loadArchivedNotes();
  }

  loadArchivedNotes(): void {
    this.isLoading = true;
    this.notesService.getArchivedNotes().subscribe({
      next: (notes) => {
        this.archivedNotes = notes;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading archived notes:', error);
        this.isLoading = false;
      }
    });
  }

  unarchiveNote(noteId: number): void {
    this.notesService.toggleArchive(noteId).subscribe({
      next: () => {
        console.log('Note unarchived successfully');
        this.loadArchivedNotes();
      },
      error: (error) => {
        console.error('Error unarchiving note:', error);
        alert('Failed to unarchive note');
      }
    });
  }

  deleteNote(noteId: number): void {
    this.notesService.deleteNote(noteId).subscribe({
      next: () => {
        console.log('Note moved to trash');
        this.loadArchivedNotes();
      },
      error: (error) => {
        console.error('Error deleting note:', error);
        alert('Failed to delete note');
      }
    });
  }
}
