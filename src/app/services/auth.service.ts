import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'https://localhost:7080/api/auth';

  constructor(private http: HttpClient) {}

  register(data: any) {
    return this.http.post(
      `${this.baseUrl}/register`,
      data,
      { responseType: 'text' }   // ✅ IMPORTANT
    ).pipe(
      tap(token => {
        localStorage.setItem('token', token);
      })
    );
  }

  login(data: any) {
    return this.http.post(
      `${this.baseUrl}/login`,
      data,
      { responseType: 'text' }   // ✅ IMPORTANT
    ).pipe(
      tap(token => {
        localStorage.setItem('token', token);
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return token !== null && token !== '';
  }
}