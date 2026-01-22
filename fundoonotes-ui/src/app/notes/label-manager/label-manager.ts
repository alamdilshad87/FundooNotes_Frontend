import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LabelService, Label } from '../../core/services/label';

@Component({
  selector: 'app-label-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './label-manager.html',
  styleUrls: ['./label-manager.scss']
})
export class LabelManagerComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() labelCreated = new EventEmitter<void>();
  @ViewChild('newLabelInput') newLabelInput!: ElementRef;

  labels: Label[] = [];
  newLabelName = '';
  editingLabel: Label | null = null;
  editLabelName = '';
  showInput = false;

  constructor(
    private labelService: LabelService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.loadLabels();
    });
  }

  loadLabels(): void {
    this.labelService.getLabels().subscribe({
      next: (labels) => {
        this.labels = labels.filter(l => !l.isDeleted);
        console.log('📋 Loaded labels:', this.labels);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('❌ Failed to load labels', err)
    });
  }

  onNewLabelInput(): void {
    this.cdr.detectChanges();
  }

  createLabel(): void {
    const trimmedName = this.newLabelName.trim();

    if (!trimmedName) {
      console.log('⚠️ Label name is empty');
      return;
    }

    console.log('✅ Creating label:', trimmedName);

    this.labelService.createLabel(trimmedName).subscribe({
      next: (newLabel) => {
        console.log('✅ Label created successfully:', newLabel);
        this.newLabelName = '';
        this.loadLabels();
        this.labelCreated.emit();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Failed to create label:', err);
        alert('Failed to create label. Please try again.');
      }
    });
  }

  clearNewLabel(): void {
    this.newLabelName = '';
    this.cdr.detectChanges();
  }

  startEdit(label: Label): void {
    this.editingLabel = label;
    this.editLabelName = label.name;
    this.cdr.detectChanges();
  }

  cancelEdit(): void {
    this.editingLabel = null;
    this.editLabelName = '';
    this.cdr.detectChanges();
  }

  updateLabel(): void {
    if (!this.editingLabel || !this.editLabelName.trim()) return;

    console.log('✏️ Updating label:', this.editingLabel.labelId, 'to:', this.editLabelName);

    this.labelService.updateLabel(this.editingLabel.labelId, this.editLabelName.trim()).subscribe({
      next: () => {
        console.log('✅ Label updated successfully');
        this.editingLabel = null;
        this.editLabelName = '';
        this.loadLabels();
        this.labelCreated.emit();
      },
      error: (err) => {
        console.error('❌ Failed to update label:', err);
        alert('Failed to update label. Please try again.');
      }
    });
  }

  deleteLabel(labelId: number): void {
    if (!confirm('Delete this label?')) return;

    console.log('🗑️ Deleting label:', labelId);

    this.labelService.deleteLabel(labelId).subscribe({
      next: () => {
        console.log('✅ Label deleted successfully');
        this.loadLabels();
        this.labelCreated.emit();
      },
      error: (err) => {
        console.error('❌ Failed to delete label:', err);
        alert('Failed to delete label. Please try again.');
      }
    });
  }

  closeModal(): void {
    this.close.emit();
  }
}
