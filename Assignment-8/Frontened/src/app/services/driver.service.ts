import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Driver } from '../models/driver';

@Injectable({
  providedIn: 'root'
})
export class DriverService {
  private apiUrl = 'http://localhost:5245/api/Driver'; // backend API base URL

  constructor(private http: HttpClient) {}

  // Get all drivers
  getDrivers(): Observable<Driver[]> {
    return this.http.get<Driver[]>(this.apiUrl);
  }

  // Optional: Get driver by username (if backend supports it)
  getDriverByUsername(username: string): Observable<Driver> {
    return this.http.get<Driver>(`${this.apiUrl}/by-username/${username}`);
  }

  addDriver(driver: Partial<Driver>): Observable<any> {
    return this.http.post(this.apiUrl, driver);
  }

  updateDriver(driver: Driver): Observable<any> {
    return this.http.put(`${this.apiUrl}/${driver.driverId}`, driver);
  }

  deleteDriver(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
