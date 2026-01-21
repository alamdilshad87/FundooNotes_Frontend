import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class NotesService {
  private baseUrl = 'https://localhost:7204/api/notes';

  constructor(private http: HttpClient) {}

  createNote(note: any): Observable<any> {
    console.log('📤 Sending createNote request:', note);
    return this.http.post(this.baseUrl, note).pipe(
      tap(response => console.log('📥 createNote response:', response))
    );
  }

  getNotes(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  deleteNote(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  getTrashedNotes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/trash`);
  }

  restoreNote(id: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}/restore`, {});
  }

  permanentDeleteNote(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}/permanent`);
  }

  getArchivedNotes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/archive`);
  }

  updateNote(id: number, note: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, note);
  }

  toggleArchive(id: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}/archive`, {});
  }
}
