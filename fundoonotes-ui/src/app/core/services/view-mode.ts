import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type ViewMode = 'grid' | 'list';

@Injectable({
  providedIn: 'root'
})
export class ViewModeService {
  private viewModeSubject = new BehaviorSubject<ViewMode>('grid');
  public viewMode$: Observable<ViewMode> = this.viewModeSubject.asObservable();

  constructor() {
    // Load from localStorage if exists
    const savedMode = localStorage.getItem('viewMode') as ViewMode;
    if (savedMode) {
      this.viewModeSubject.next(savedMode);
    }
  }

  getViewMode(): ViewMode {
    return this.viewModeSubject.value;
  }

  setViewMode(mode: ViewMode): void {
    this.viewModeSubject.next(mode);
    localStorage.setItem('viewMode', mode);
    console.log('🔄 View mode changed to:', mode);
  }

  toggleViewMode(): void {
    const newMode = this.viewModeSubject.value === 'grid' ? 'list' : 'grid';
    this.setViewMode(newMode);
  }
}
