import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header';
import { SidebarComponent } from './sidebar/sidebar';
import { LabelManagerComponent } from './label-manager/label-manager';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent, LabelManagerComponent],
  templateUrl: './notes.html',
  styleUrls: ['./notes.scss']
})
export class NotesComponent {
  @ViewChild(SidebarComponent) sidebar?: SidebarComponent;
  @ViewChild(RouterOutlet) outlet?: RouterOutlet;

  sidebarCollapsed = false;
  showLabelManager = false;

  constructor(private router: Router) {}

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  openLabelManager(): void {
    console.log('🚪 Opening label manager');
    this.showLabelManager = true;
  }

  closeLabelManager(): void {
    console.log('🚪 Closing label manager');
    this.showLabelManager = false;
  }

  onLabelCreated(): void {
    console.log('✅ Label created - refreshing sidebar');
    if (this.sidebar) {
      this.sidebar.loadLabels();
    }
  }

  onSearch(query: string): void {
    console.log('🔍 Notes component search:', query);
    const component = this.outlet?.component as any;
    if (component && typeof component.onSearch === 'function') {
      component.onSearch(query);
    }
  }
}
