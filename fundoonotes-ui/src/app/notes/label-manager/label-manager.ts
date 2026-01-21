import { Component, OnInit } from '@angular/core';
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
  labels: Label[] = [];
  newLabelName = '';
  editingLabel: Label | null = null;
  editLabelName = '';
  showInput = false;

  constructor(private labelService: LabelService) {}

  ngOnInit(): void {
    this.loadLabels();
  }

  loadLabels(): void {
    this.labelService.getLabels().subscribe({
      next: (labels) => {
        this.labels = labels;
      },
      error: (err) => console.error('Failed to load labels', err)
    });
  }

  createLabel(): void {
    if (!this.newLabelName.trim()) return;

    this.labelService.createLabel(this.newLabelName).subscribe({
      next: () => {
        this.newLabelName = '';
        this.showInput = false;
        this.loadLabels();
      },
      error: (err) => console.error('Failed to create label', err)
    });
  }

  startEdit(label: Label): void {
    this.editingLabel = label;
    this.editLabelName = label.name;
  }

  cancelEdit(): void {
    this.editingLabel = null;
    this.editLabelName = '';
  }

  updateLabel(): void {
    if (!this.editingLabel || !this.editLabelName.trim()) return;

    this.labelService.updateLabel(this.editingLabel.labelId, this.editLabelName).subscribe({
      next: () => {
        this.editingLabel = null;
        this.editLabelName = '';
        this.loadLabels();
      },
      error: (err) => console.error('Failed to update label', err)
    });
  }

  deleteLabel(labelId: number): void {
    if (!confirm('Delete this label?')) return;

    this.labelService.deleteLabel(labelId).subscribe({
      next: () => {
        this.loadLabels();
      },
      error: (err) => console.error('Failed to delete label', err)
    });
  }

  toggleInput(): void {
    this.showInput = !this.showInput;
    this.newLabelName = '';
  }
}
