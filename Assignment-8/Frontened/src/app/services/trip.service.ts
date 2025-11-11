import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  private apiUrl = 'http://localhost:5245/api/Trips';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // GET all trips + summary
  getTrips(): Observable<any> {
    return this.http.get<any>(this.apiUrl, { headers: this.getHeaders() });
  }

  // POST create new trip
  addTrip(trip: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, trip, { headers: this.getHeaders() });
  }

  // PUT complete trip
  completeTrip(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/complete/${id}`, {}, { headers: this.getHeaders() });
  }

  // DELETE trip
  deleteTrip(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
