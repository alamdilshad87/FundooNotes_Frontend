import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Label {
  labelId: number;
  name: string;
  userId: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class LabelService {
  private apiUrl = 'https://localhost:7204/api/labels';
  private notesApiUrl = 'https://localhost:7204/api/notes';

  constructor(private http: HttpClient) {}

  // Label CRUD operations
  getLabels(): Observable<Label[]> {
    return this.http.get<Label[]>(this.apiUrl);
  }

  createLabel(name: string): Observable<any> {
    // Send as JSON string wrapped in quotes
    return this.http.post(this.apiUrl, JSON.stringify(name), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  updateLabel(labelId: number, name: string): Observable<any> {
    // Send as JSON string wrapped in quotes
    return this.http.put(`${this.apiUrl}/${labelId}`, JSON.stringify(name), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  deleteLabel(labelId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${labelId}`);
  }

  // Note-Label operations
  addLabelToNote(noteId: number, labelId: number): Observable<any> {
    return this.http.post(`${this.notesApiUrl}/${noteId}/labels/${labelId}`, {});
  }

  removeLabelFromNote(noteId: number, labelId: number): Observable<any> {
    return this.http.delete(`${this.notesApiUrl}/${noteId}/labels/${labelId}`);
  }

  getLabelsByNote(noteId: number): Observable<Label[]> {
    return this.http.get<Label[]>(`${this.notesApiUrl}/${noteId}/labels`);
  }
}
