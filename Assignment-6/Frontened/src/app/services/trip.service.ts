import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trip } from '../models/trip.model';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  private apiUrl = 'http://localhost:5045/api/Trip'; // your backend URL

  constructor(private http: HttpClient) {}

  getTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(this.apiUrl);
  }

  updateTrip(id: number, trip: Trip): Observable<Trip> {
    return this.http.put<Trip>(`${this.apiUrl}/${id}`, trip);
  }

  createTrip(trip: Trip): Observable<Trip> {
    return this.http.post<Trip>(this.apiUrl, trip);
  }
}

