import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TakeNoteComponent } from '../take-note/take-note';
import { NoteCardComponent } from '../note-card/note-card';
import { EditNoteModalComponent } from '../edit-note-modal/edit-note-modal';
import { LabelService } from '../../core/services/label';
import { NotesService } from '../../core/services/notes'; // ✅ FIX: Change NoteService to NotesService

@Component({
  selector: 'app-label-view',
  standalone: true,
  imports: [CommonModule, TakeNoteComponent, NoteCardComponent, EditNoteModalComponent],
  templateUrl: './label-view.html',
  styleUrls: ['./label-view.scss']
})
export class LabelViewComponent implements OnInit {
  label: any = null;
  notes: any[] = [];
  isLoading = false;
  selectedNote: any = null;
  openColorPickerNoteId: number | null = null;
  viewMode: string = 'grid';
  currentLabelId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private labelService: LabelService,
    private noteService: NotesService, // ✅ FIX: Change to NotesService
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const labelId = +params['id'];
      this.currentLabelId = labelId;
      this.loadLabelAndNotes(labelId);
    });
  }

  loadLabelAndNotes(labelId: number): void {
    this.isLoading = true;

    this.labelService.getLabels().subscribe({
      next: (labels) => {
        this.label = labels.find(l => l.labelId === labelId);
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Error loading label:', err)
    });

    this.labelService.getNotesByLabel(labelId).subscribe({
      next: (notes) => {
        this.notes = notes;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error loading notes:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  handleLabelsUpdated(event: { noteId: number; labels: string[] }): void {
    const note = this.notes.find(n => n.noteId === event.noteId);
    if (note) {
      note.labels = event.labels;

      if (this.label && !event.labels.includes(this.label.name)) {
        this.notes = this.notes.filter(n => n.noteId !== event.noteId);
        console.log(`✅ Note ${event.noteId} removed from label view`);
      }

      this.cdr.detectChanges();
    }
  }

  saveNote(noteData: any): void {
    if (this.label) {
      noteData.labels = noteData.labels || [];
      if (!noteData.labels.includes(this.label.name)) {
        noteData.labels.push(this.label.name);
      }
    }

    this.noteService.createNote(noteData).subscribe({
      next: (newNote: any) => {
        this.notes.unshift(newNote);
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Error creating note:', err)
    });
  }

  deleteNote(noteId: number): void {
    this.noteService.deleteNote(noteId).subscribe({
      next: () => {
        this.notes = this.notes.filter(n => n.noteId !== noteId);
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Error deleting note:', err)
    });
  }

  archiveNote(noteId: number): void {
    this.noteService.archiveNote(noteId).subscribe({
      next: () => {
        this.notes = this.notes.filter(n => n.noteId !== noteId);
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Error archiving note:', err)
    });
  }

  togglePin(noteId: number): void {
    const note = this.notes.find(n => n.noteId === noteId);
    if (note) {
      this.noteService.togglePin(noteId).subscribe({
        next: () => {
          note.isPinned = !note.isPinned;
          this.cdr.detectChanges();
        },
        error: (err: any) => console.error('Error toggling pin:', err)
      });
    }
  }

  openNoteForEdit(note: any): void {
    this.selectedNote = { ...note };
  }

  closeEditModal(): void {
    this.selectedNote = null;
  }

  updateNote(updatedNote: any): void {
    this.noteService.updateNote(updatedNote.noteId, updatedNote).subscribe({
      next: () => {
        const index = this.notes.findIndex(n => n.noteId === updatedNote.noteId);
        if (index !== -1) {
          if (this.label && !updatedNote.labels.includes(this.label.name)) {
            this.notes = this.notes.filter(n => n.noteId !== updatedNote.noteId);
          } else {
            this.notes[index] = updatedNote;
          }
        }
        this.selectedNote = null;
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Error updating note:', err)
    });
  }

  updateNoteColor(event: { noteId: number; color: string }): void {
    this.noteService.updateColor(event.noteId, event.color).subscribe({
      next: () => {
        const note = this.notes.find(n => n.noteId === event.noteId);
        if (note) {
          note.color = event.color;
          this.openColorPickerNoteId = null;
          this.cdr.detectChanges();
        }
      },
      error: (err: any) => console.error('Error updating color:', err)
    });
  }

  handleColorPickerToggle(noteId: number): void {
    this.openColorPickerNoteId = this.openColorPickerNoteId === noteId ? null : noteId;
    this.cdr.detectChanges();
  }
}
