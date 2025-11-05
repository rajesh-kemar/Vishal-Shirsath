// trip.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TripService {
  private apiUrl = 'http://localhost:5242/api/Trips';

  constructor(private http: HttpClient) {}

  getTrips(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addTrip(trip: any): Observable<any> {
    // Convert datetime-local string to proper ISO format
    trip.startTime = new Date(trip.startTime).toISOString();
    return this.http.post<any>(this.apiUrl, trip);
  }

  completeTrip(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/complete/${id}`, {});
  }
}
