import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Trip } from '../../models/trip';

@Component({
  selector: 'app-trips',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.css']
})
export class TripsComponent implements OnInit {
  trips: Trip[] = [];
  newTrip: Partial<Trip> = {};
  selectedTripId: number | null = null;

  apiUrl = 'http://localhost:5245/api/Trips';
  driversUrl = 'http://localhost:5245/api/Driver';
  vehiclesUrl = 'http://localhost:5245/api/Vehicles';

  drivers: any[] = [];
  vehicles: any[] = [];
  role: string | null = localStorage.getItem('role');
  token: string | null = localStorage.getItem('token');

  isLoading = false;
  errorMsg = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadTrips();

    if (this.role === 'dispatcher') {
      this.loadDrivers();
      this.loadVehicles();
    }
  }

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
  }

  loadDrivers(): void {
    this.http.get<any>(this.driversUrl, { headers: this.getAuthHeaders() }).subscribe({
      next: (res) => {
        this.drivers = Array.isArray(res) ? res : res.drivers || res.Drivers || [];
      },
      error: (err) => console.error('Error loading drivers:', err)
    });
  }

  loadVehicles(): void {
    this.http.get<any>(this.vehiclesUrl, { headers: this.getAuthHeaders() }).subscribe({
      next: (res) => {
        this.vehicles = Array.isArray(res) ? res : res.vehicles || res.Vehicles || [];
      },
      error: (err) => console.error('Error loading vehicles:', err)
    });
  }

  loadTrips(): void {
    this.isLoading = true;
    this.http.get<any>(this.apiUrl, { headers: this.getAuthHeaders() }).subscribe({
      next: (res) => {
        const tripArray = Array.isArray(res) ? res : res.trips || res.Trips || [];
        this.trips = tripArray;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading trips:', err);
        this.errorMsg = '❌ Failed to load trips.';
        this.isLoading = false;
      }
    });
  }

  addOrUpdateTrip(): void {
    if (
      !this.newTrip.driverId ||
      !this.newTrip.vehicleType ||
      !this.newTrip.source ||
      !this.newTrip.destination
    ) {
      alert('Please fill all required fields');
      return;
    }

    if (this.selectedTripId) {
      this.http.put(`${this.apiUrl}/${this.selectedTripId}`, this.newTrip, { headers: this.getAuthHeaders() })
        .subscribe({
          next: () => {
            alert('Trip updated successfully!');
            this.resetForm();
            this.loadTrips();
          },
          error: (err) => console.error('Error updating trip:', err)
        });
    } else {
      this.http.post(this.apiUrl, this.newTrip, { headers: this.getAuthHeaders() }).subscribe({
        next: () => {
          alert('Trip created successfully!');
          this.resetForm();
          this.loadTrips();
        },
        error: (err) => console.error('Error creating trip:', err)
      });
    }
  }

  completeTrip(id: number): void {
    if (confirm('Mark this trip as completed?')) {
      this.http.put(`${this.apiUrl}/complete/${id}`, {}, { headers: this.getAuthHeaders() }).subscribe({
        next: () => this.loadTrips(),
        error: (err) => console.error('Error completing trip:', err)
      });
    }
  }

  deleteTrip(id: number): void {
    if (confirm('Are you sure you want to delete this trip?')) {
      this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() }).subscribe({
        next: () => this.loadTrips(),
        error: (err) => console.error('Error deleting trip:', err)
      });
    }
  }

  editTrip(t: Trip): void {
    this.newTrip = { ...t };
    this.selectedTripId = t.tripId || null;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  resetForm(): void {
    this.newTrip = {};
    this.selectedTripId = null;
  }
}
