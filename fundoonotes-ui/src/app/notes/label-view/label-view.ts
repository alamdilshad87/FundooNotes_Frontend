import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NoteCardComponent } from '../note-card/note-card';
import { EditNoteModalComponent } from '../edit-note-modal/edit-note-modal';
import { TakeNoteComponent } from '../take-note/take-note';
import { NotesService } from '../../core/services/notes';
import { LabelService, Label } from '../../core/services/label';
import { ViewModeService, ViewMode } from '../../core/services/view-mode';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-label-view',
  standalone: true,
  imports: [CommonModule, NoteCardComponent, EditNoteModalComponent, TakeNoteComponent],
  templateUrl: './label-view.html',
  styleUrls: ['./label-view.scss']
})
export class LabelViewComponent implements OnInit, OnDestroy {
  labelId!: number;
  label: Label | null = null;
  notes: any[] = [];
  isLoading = false;
  selectedNote: any = null;
  openColorPickerNoteId: number | null = null;
  viewMode: ViewMode = 'grid';
  private viewModeSubscription?: Subscription;
  private routeSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private notesService: NotesService,
    private labelService: LabelService,
    private viewModeService: ViewModeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe(params => {
      this.labelId = +params['id'];
      console.log('📋 Label ID:', this.labelId);
      this.loadLabel();
      this.loadNotes();
    });

    this.viewModeSubscription = this.viewModeService.viewMode$.subscribe(mode => {
      this.viewMode = mode;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.viewModeSubscription?.unsubscribe();
    this.routeSubscription?.unsubscribe();
  }

  loadLabel(): void {
    this.labelService.getLabels().subscribe({
      next: (labels: Label[]) => {
        this.label = labels.find(l => l.labelId === this.labelId) || null;
        console.log('📋 Label loaded:', this.label);
        if (!this.label) {
          console.warn('⚠️ Label not found');
          this.router.navigate(['/notes']);
        }
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('❌ Error loading label:', err);
        this.router.navigate(['/notes']);
      }
    });
  }

  loadNotes(): void {
    this.isLoading = true;
    this.labelService.getNotesByLabel(this.labelId).subscribe({
      next: (notes: any[]) => {
        this.notes = notes.filter((n: any) => !n.isArchived && !n.isTrashed);
        console.log('📝 Notes loaded:', this.notes.length);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('❌ Error loading notes:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  saveNote(noteData: any): void {
    this.notesService.createNote(noteData).subscribe({
      next: (newNote: any) => {
        console.log('✅ Note created:', newNote);
        this.labelService.addLabelToNote(newNote.noteId, this.labelId).subscribe({
          next: () => {
            console.log('✅ Label attached to note');
            this.loadNotes();
          },
          error: (err: any) => console.error('❌ Error attaching label:', err)
        });
      },
      error: (err: any) => console.error('❌ Error creating note:', err)
    });
  }

  deleteNote(noteId: number): void {
    this.notes = this.notes.filter(n => n.noteId !== noteId);
    this.cdr.detectChanges();

    this.notesService.deleteNote(noteId).subscribe({
      next: () => console.log('✅ Note deleted'),
      error: (err: any) => {
        console.error('❌ Error deleting note:', err);
        this.loadNotes();
      }
    });
  }

  archiveNote(noteId: number): void {
    this.notes = this.notes.filter(n => n.noteId !== noteId);
    this.cdr.detectChanges();

    this.notesService.toggleArchive(noteId).subscribe({
      next: () => console.log('✅ Note archived'),
      error: (err: any) => {
        console.error('❌ Error archiving note:', err);
        this.loadNotes();
      }
    });
  }

  togglePin(noteId: number): void {
    const note = this.notes.find(n => n.noteId === noteId);
    if (note) {
      note.isPinned = !note.isPinned;
      this.cdr.detectChanges();
    }

    this.notesService.togglePin(noteId).subscribe({
      next: () => console.log('✅ Pin toggled'),
      error: (err: any) => {
        console.error('❌ Error toggling pin:', err);
        if (note) {
          note.isPinned = !note.isPinned;
          this.cdr.detectChanges();
        }
      }
    });
  }

  openNoteForEdit(note: any): void {
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

    const note = this.notes.find(n => n.noteId === updatedNote.noteId);
    if (note) {
      Object.assign(note, payload);
      this.cdr.detectChanges();
    }

    this.notesService.updateNote(updatedNote.noteId, payload).subscribe({
      next: () => console.log('✅ Note updated'),
      error: (err: any) => {
        console.error('❌ Error updating note:', err);
        this.loadNotes();
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
      next: () => console.log('✅ Color updated'),
      error: (err: any) => {
        console.error('❌ Error updating color:', err);
        note.color = oldColor;
        this.cdr.detectChanges();
      }
    });
  }

  handleColorPickerToggle(noteId: number): void {
    this.openColorPickerNoteId = this.openColorPickerNoteId === noteId ? null : noteId;
  }
}
