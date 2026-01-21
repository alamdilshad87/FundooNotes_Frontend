import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabelService, Label } from '../../core/services/label';

@Component({
  selector: 'app-label-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './label-selector.html',
  styleUrls: ['./label-selector.scss']
})
export class LabelSelectorComponent implements OnInit {
  @Input() noteId!: number;
  @Input() currentLabels: string[] = [];
  @Output() labelsChanged = new EventEmitter<void>();

  allLabels: Label[] = [];
  showDropdown = false;

  constructor(private labelService: LabelService) {}

  ngOnInit(): void {
    this.loadLabels();
  }

  loadLabels(): void {
    this.labelService.getLabels().subscribe({
      next: (labels) => {
        this.allLabels = labels;
      },
      error: (err) => console.error('Failed to load labels', err)
    });
  }

  isLabelAttached(labelName: string): boolean {
    return this.currentLabels.includes(labelName);
  }

  toggleLabel(label: Label): void {
    if (this.isLabelAttached(label.name)) {
      this.labelService.removeLabelFromNote(this.noteId, label.labelId).subscribe({
        next: () => {
          this.labelsChanged.emit();
        },
        error: (err) => console.error('Failed to remove label', err)
      });
    } else {
      this.labelService.addLabelToNote(this.noteId, label.labelId).subscribe({
        next: () => {
          this.labelsChanged.emit();
        },
        error: (err) => console.error('Failed to add label', err)
      });
    }
  }
}
