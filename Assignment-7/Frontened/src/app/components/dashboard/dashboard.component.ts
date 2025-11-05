import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TripService } from '../../services/trip.service';
import { VehicleService } from '../../services/vehicle.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  trips: any[] = [];
  vehicles: any[] = [];
  activeTrips: any[] = [];
  completedTrips: any[] = [];
  availableVehicles: any[] = [];

  // Flags for which table to show
  showActiveTrips: boolean = false;
  showCompletedTrips: boolean = false;
  showAvailableVehicles: boolean = false;

  constructor(
    private tripService: TripService,
    private vehicleService: VehicleService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    // Load all trips and normalize keys
    this.tripService.getTrips().subscribe({
      next: (data) => {
        this.trips = data.map((t: any) => ({
          tripId: t.TripId || t.tripId,
          driverName: t.DriverName || t.driverName,
          vehicleNumber: t.VehicleNumber || t.vehicleNumber,
          source: t.Source || t.source,
          destination: t.Destination || t.destination,
          startTime: t.StartTime || t.startTime,
          endTime: t.EndTime || t.endTime,
          status: t.Status || t.status,
          durationHours: t.DurationHours || t.durationHours,
          isExtended: t.IsExtended || t.isExtended
        }));
      },
      error: (err) => console.error('Error fetching trips', err)
    });

    // Load all vehicles
    this.vehicleService.getVehicles().subscribe({
      next: (data) => this.vehicles = data,
      error: (err) => console.error('Error fetching vehicles', err)
    });
  }

  // Show Active Trips table
  showActive() {
    this.activeTrips = this.trips.filter(t => t.status?.toLowerCase() === 'active');
    this.showActiveTrips = true;
    this.showCompletedTrips = false;
    this.showAvailableVehicles = false;
  }

  // Show Completed Trips table
  showCompleted() {
    this.completedTrips = this.trips.filter(t => t.status?.toLowerCase() === 'completed');
    this.showActiveTrips = false;
    this.showCompletedTrips = true;
    this.showAvailableVehicles = false;
  }

  // Show Available Vehicles table
  showAvailable() {
    this.availableVehicles = this.vehicles.filter(v => v.isAvailable === true);
    this.showActiveTrips = false;
    this.showCompletedTrips = false;
    this.showAvailableVehicles = true;
  }
}























































































































// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { TripService } from '../../services/trip.service';
// import { VehicleService } from '../../services/vehicle.service';

// @Component({
//   selector: 'app-dashboard',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './dashboard.component.html',
//   styleUrls: ['./dashboard.component.css']
// })
// export class DashboardComponent implements OnInit {

//   trips: any[] = [];
//   vehicles: any[] = [];
//   activeTrips: any[] = [];
//   completedTrips: any[] = [];
//   availableVehicles: any[] = [];

//   // Flags for which table to show
//   showActiveTrips: boolean = false;
//   showCompletedTrips: boolean = false;
//   showAvailableVehicles: boolean = false;

//   constructor(
//     private tripService: TripService,
//     private vehicleService: VehicleService
//   ) {}

//   ngOnInit(): void {
//     this.loadData();
//   }

//   loadData() {
//     // Load all trips
//     this.tripService.getTrips().subscribe({
//       next: (data) => this.trips = data,
//       error: (err) => console.error('Error fetching trips', err)
//     });

//     // Load all vehicles
//     this.vehicleService.getVehicles().subscribe({
//       next: (data) => this.vehicles = data,
//       error: (err) => console.error('Error fetching vehicles', err)
//     });
//   }

//   // Show Active Trips table
//   showActive() {
//     this.activeTrips = this.trips.filter(t => t.status?.toLowerCase() === 'active');
//     this.showActiveTrips = true;
//     this.showCompletedTrips = false;
//     this.showAvailableVehicles = false;
//   }

//   // Show Completed Trips table
//   showCompleted() {
//     this.completedTrips = this.trips.filter(t => t.status?.toLowerCase() === 'completed');
//     this.showActiveTrips = false;
//     this.showCompletedTrips = true;
//     this.showAvailableVehicles = false;
//   }

//   // Show Available Vehicles table
//   showAvailable() {
//     this.availableVehicles = this.vehicles.filter(v => v.isAvailable === true);
//     this.showActiveTrips = false;
//     this.showCompletedTrips = false;
//     this.showAvailableVehicles = true;
//   }
// }
