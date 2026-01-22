import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { LabelService, Label } from '../../core/services/label';
import { LabelManagerComponent } from '../label-manager/label-manager';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LabelManagerComponent],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss']
})
export class SidebarComponent implements OnInit {
  @Input() collapsed: boolean = false;

  labels: Label[] = [];
  showLabelManager = false; // ✅ Control modal

  constructor(
    private labelService: LabelService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadLabels();
  }

  loadLabels(): void {
    this.labelService.getLabels().subscribe({
      next: (labels: Label[]) => {
        this.labels = labels.filter(l => !l.isDeleted);
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('❌ Error loading sidebar labels:', err);
      }
    });
  }

  openLabelManager(): void {
    this.showLabelManager = true;
  }

  closeLabelManager(): void {
    this.showLabelManager = false;
  }

  onLabelChange(): void {
    this.loadLabels(); // ✅ Refresh sidebar when labels change
  }
}
