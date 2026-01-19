import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header';
import { SidebarComponent } from './sidebar/sidebar';
import { DashboardComponent } from './dashboard/dashboard';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule, HeaderComponent, SidebarComponent, DashboardComponent],
  templateUrl: './notes.html',
  styleUrls: ['./notes.scss']
})
export class NotesComponent {
  sidebarCollapsed = false;
}
