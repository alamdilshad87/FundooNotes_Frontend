import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkMode = new BehaviorSubject<boolean>(false);
  public isDarkMode$ = this.isDarkMode.asObservable();

  constructor() {
    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.enableDarkMode();
    }
  }

  toggleDarkMode(): void {
    if (this.isDarkMode.value) {
      this.disableDarkMode();
    } else {
      this.enableDarkMode();
    }
  }

  enableDarkMode(): void {
    document.body.classList.add('dark-theme');
    this.isDarkMode.next(true);
    localStorage.setItem('theme', 'dark');
  }

  disableDarkMode(): void {
    document.body.classList.remove('dark-theme');
    this.isDarkMode.next(false);
    localStorage.setItem('theme', 'light');
  }

  getDarkMode(): boolean {
    return this.isDarkMode.value;
  }
}
