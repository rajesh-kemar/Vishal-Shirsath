import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DriverService {
  private apiUrl = 'http://localhost:5242/api/Driver';

  constructor(private http: HttpClient) {}

  getDrivers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addDriver(driver: any): Observable<any> {
    return this.http.post(this.apiUrl, driver);
  }

  deleteDriver(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
