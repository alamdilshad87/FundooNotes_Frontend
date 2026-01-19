import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TakeNoteComponent } from '../take-note/take-note';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TakeNoteComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent {

  notes: any[] = [];

  addNote(note: any): void {
    // later: call POST API here
    this.notes.unshift(note);
  }
}
