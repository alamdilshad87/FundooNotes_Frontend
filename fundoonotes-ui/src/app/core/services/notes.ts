import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotesService {
  private baseUrl = 'https://localhost:7204/api/notes';

  constructor(private http: HttpClient) {}

  createNote(note: any): Observable<any> {
    return this.http.post(this.baseUrl, note);
  }

  getNotes(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  // ✅ Move to trash (soft delete)
  deleteNote(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  // ✅ Get trashed notes
  getTrashedNotes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/trash`);
  }

  // ✅ Restore from trash
  restoreNote(id: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}/restore`, {});
  }

  // ✅ Permanently delete
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
