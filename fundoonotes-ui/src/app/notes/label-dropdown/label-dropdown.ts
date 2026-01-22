import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LabelService, Label } from '../../core/services/label';

@Component({
  selector: 'app-label-dropdown',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './label-dropdown.html',
  styleUrls: ['./label-dropdown.scss']
})
export class LabelDropdownComponent implements OnInit {
  @Input() noteId?: number;
  @Input() currentLabels: string[] = [];
  @Output() labelsChanged = new EventEmitter<string[]>();
  @Output() close = new EventEmitter<void>();

  allLabels: Label[] = [];
  searchText: string = '';

  constructor(
    private labelService: LabelService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadLabels();
  }

  loadLabels(): void {
    this.labelService.getLabels().subscribe({
      next: (labels: Label[]) => {
        this.allLabels = labels.filter(l => !l.isDeleted);
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('❌ Error loading labels:', err)
    });
  }

  isLabelSelected(labelName: string): boolean {
    return this.currentLabels.includes(labelName);
  }

  toggleLabel(label: Label): void {
    if (!this.noteId) {
      // For new notes, just update the array
      if (this.isLabelSelected(label.name)) {
        this.currentLabels = this.currentLabels.filter(l => l !== label.name);
      } else {
        this.currentLabels = [...this.currentLabels, label.name];
      }
      this.labelsChanged.emit(this.currentLabels);
      return;
    }

    // For existing notes, call the API
    if (this.isLabelSelected(label.name)) {
      this.labelService.removeLabelFromNote(this.noteId, label.labelId).subscribe({
        next: () => {
          this.currentLabels = this.currentLabels.filter(l => l !== label.name);
          this.labelsChanged.emit(this.currentLabels);
          this.cdr.detectChanges();
        },
        error: (err: any) => console.error('❌ Error removing label:', err)
      });
    } else {
      this.labelService.addLabelToNote(this.noteId, label.labelId).subscribe({
        next: () => {
          this.currentLabels = [...this.currentLabels, label.name];
          this.labelsChanged.emit(this.currentLabels);
          this.cdr.detectChanges();
        },
        error: (err: any) => console.error('❌ Error adding label:', err)
      });
    }
  }

  closeDropdown(): void {
    this.close.emit();
  }
}
