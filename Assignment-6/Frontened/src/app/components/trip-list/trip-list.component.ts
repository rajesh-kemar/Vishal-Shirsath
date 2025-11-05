
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TripService } from '../../services/trip.service';
import { Trip } from '../../models/trip.model';
import { VehicleService } from '../../services/Vehicle.service';

@Component({
  selector: 'app-trip-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <h3 class="mb-3 text-center">All Trips</h3>
      <div class="table-responsive">
        <table class="table table-bordered table-striped text-center align-middle w-100">
          <thead class="table-dark">
            <tr>
              <th>ID</th>
              <th>Vehicle</th> <!-- Vehicle column added -->
              <th>Driver ID</th>
              <th>Source</th>
              <th>Destination</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let trip of trips">
              <td>{{ trip.tripId }}</td>
              <td>{{ getVehicleNumber(trip.vehicleId) || 'Loading...' }}</td> <!-- Vehicle info -->
              <td>{{ trip.driverId }}</td>
              <td>{{ trip.source }}</td>
              <td>{{ trip.destination }}</td>
              <td>{{ trip.startTime | date: 'dd/MM/yyyy, h:mm a' }}</td>
              <td>{{ trip.endTime | date: 'dd/MM/yyyy, h:mm a' }}</td>
             <td
             [ngClass]="{
             'text-success fw-bold': trip.status === 'completed',
             'text-danger fw-bold': trip.status === 'in-progress'
             }"
            >
            {{ trip.status }}
            </td>
              <td>
                <button
                  class="btn btn-sm btn-success"
                  [disabled]="trip.status === 'completed'"
                  (click)="markAsCompleted(trip)"
                >
                  Mark as Completed
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [
    `
      table {
        border-collapse: collapse;
      }
      th, td {
        border: 1px solid #000 !important;
        padding: 12px 16px;
      }
      th {
        background-color: #343a40;
        color: white;
      }
      .btn-success:disabled {
        background-color: gray;
        border-color: gray;
      }
    `
  ]
})
export class TripListComponent implements OnInit {
  trips: Trip[] = [];
  vehicles: any[] = []; // store vehicles for lookup

  constructor(
    private tripService: TripService,
    private vehicleService: VehicleService
  ) {}

  ngOnInit(): void {
    this.loadTrips();
    this.loadVehicles();
  }

  loadTrips(): void {
    this.tripService.getTrips().subscribe({
      next: (data) => (this.trips = data),
      error: (err) => console.error('Error fetching trips:', err)
    });
  }

  loadVehicles(): void {
    this.vehicleService.getVehicles().subscribe({
      next: (data) => (this.vehicles = data),
      error: (err) => console.error('Error fetching vehicles:', err)
    });
  }

  // Helper function to get vehicle numberPlate from vehicleId
  getVehicleNumber(vehicleId: number | undefined): string | undefined {
    if(vehicleId == undefined) return undefined;
    const vehicle = this.vehicles.find(v => v.vehicleId === vehicleId);
    return vehicle ? vehicle.numberPlate : undefined;
  }

  markAsCompleted(trip: Trip): void {
    if (!trip.tripId) {
      console.error('Trip ID missing!');
      return;
    }

    const updatedTrip = { ...trip, status: 'completed' };
    this.tripService.updateTrip(trip.tripId, updatedTrip).subscribe({
      next: () => {
        trip.status = 'completed';
        console.log(`Trip ${trip.tripId} marked as completed`);
      },
      error: (err) => console.error('Error updating trip status:', err)
    });
  }
}




