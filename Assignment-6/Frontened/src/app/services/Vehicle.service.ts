import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private apiUrl = 'http://localhost:5045/api/Vehicle'; // your API endpoint

  constructor(private http: HttpClient) {}

  // Fetch only available vehicles
  getAvailableVehicles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?status=available`);
  }

  // Optional: get all vehicles
  getVehicles(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}

