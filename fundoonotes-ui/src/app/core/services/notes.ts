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
  updateNote(id: number, note: any) {
  return this.http.put(
    `${this.baseUrl}/${id}`,
    note
  );
}

}
