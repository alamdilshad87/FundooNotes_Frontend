import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { LabelService, Label } from '../../core/services/label';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss']
})
export class SidebarComponent implements OnInit {
  @Input() collapsed: boolean = false;
  @Output() openLabelManagerRequest = new EventEmitter<void>();

  labels: Label[] = [];

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
        console.log('📋 Sidebar labels:', this.labels);
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('❌ Error loading sidebar labels:', err);
      }
    });
  }

  openLabelManager(): void {
    console.log('🚪 Requesting label manager open');
    this.openLabelManagerRequest.emit();
  }

  // ✅ ADD THIS METHOD - Called from parent when labels change
  refreshLabels(): void {
    console.log('🔄 Refreshing sidebar labels');
    this.loadLabels();
  }
}
