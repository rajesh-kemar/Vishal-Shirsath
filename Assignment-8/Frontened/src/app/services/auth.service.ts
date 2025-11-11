import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5245/api/Auth';
  private tokenKey = 'token';
  private userKey = 'user';

  constructor(private http: HttpClient, private router: Router) {}

  registerDriver(driver: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, driver);
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { username, password }).pipe(
      tap((response: any) => {
        if (response && response.token) {
          const role = response.role.toLowerCase(); // ✅ normalize
          localStorage.setItem(this.tokenKey, response.token);
          localStorage.setItem(
            this.userKey,
            JSON.stringify({
              username: response.username,
              role
            })
          );
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUser(): any {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  getRole(): string | null {
    const user = this.getUser();
    return user ? user.role.toLowerCase() : null;
  }

  getUsername(): string | null {
    const user = this.getUser();
    return user ? user.username : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
