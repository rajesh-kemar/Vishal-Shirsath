import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VehicleService {
  private apiUrl = 'http://localhost:5242/api/Vehicles';

  constructor(private http: HttpClient) {}

  getVehicles(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getAvailableVehicles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/available`);
  }

  addVehicle(vehicle: any): Observable<any> {
    return this.http.post(this.apiUrl, vehicle);
  }

  deleteVehicle(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
