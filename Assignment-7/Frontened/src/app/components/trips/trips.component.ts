import { Component, OnInit } from '@angular/core';
import { TripService } from '../../services/trip.service';
import { DriverService } from '../../services/driver.service';
import { VehicleService } from '../../services/vehicle.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-trips',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.css']
})
export class TripsComponent implements OnInit {
  trips: any[] = [];
  drivers: any[] = [];
  vehicles: any[] = [];

  newTrip = {
    driverId: 0,
    vehicleId: 0,
    source: '',
    destination: '',
    startTime: new Date().toISOString().slice(0, 16),
    endTime: '',
    status: 'Active'
  };

  constructor(
    private tripService: TripService,
    private driverService: DriverService,
    private vehicleService: VehicleService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    // Load trips and normalize API keys to camelCase
    this.tripService.getTrips().subscribe({
      next: data => {
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
      error: err => console.error('Error loading trips', err)
    });

    this.driverService.getDrivers().subscribe({
      next: data => this.drivers = data,
      error: err => console.error('Error loading drivers', err)
    });

    this.vehicleService.getAvailableVehicles().subscribe({
      next: data => this.vehicles = data,
      error: err => console.error('Error loading vehicles', err)
    });
  }

  addTrip(): void {
    const payload = {
      driverId: Number(this.newTrip.driverId),
      vehicleId: Number(this.newTrip.vehicleId),
      source: this.newTrip.source.trim(),
      destination: this.newTrip.destination.trim(),
      startTime: new Date(this.newTrip.startTime).toISOString(),
      endTime: this.newTrip.endTime ? new Date(this.newTrip.endTime).toISOString() : null,
      status: this.newTrip.status
    };

    if (!payload.driverId || !payload.vehicleId) {
      alert('Select both driver and vehicle');
      return;
    }

    if (!payload.source || !payload.destination) {
      alert('Please enter both Source and Destination');
      return;
    }

    this.tripService.addTrip(payload).subscribe({
      next: () => {
        alert('Trip created successfully!');
        this.resetNewTrip();
        this.loadData();
      },
      error: err => {
        console.error('Error adding trip', err);
        alert('Failed to add trip: ' + (err.error || err.message));
      }
    });
  }

  completeTrip(id: number): void {
    this.tripService.completeTrip(id).subscribe({
      next: () => {
        alert('Trip marked as completed!');
        this.loadData();
      },
      error: err => {
        console.error('Error completing trip', err);
        alert('Failed to complete trip');
      }
    });
  }

  private resetNewTrip(): void {
    this.newTrip = {
      driverId: 0,
      vehicleId: 0,
      source: '',
      destination: '',
      startTime: new Date().toISOString().slice(0, 16),
      endTime: '',
      status: 'Active'
    };
  }
}

















































































































// import { Component, OnInit } from '@angular/core';
// import { TripService } from '../../services/trip.service';
// import { DriverService } from '../../services/driver.service';
// import { VehicleService } from '../../services/vehicle.service';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-trips',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './trips.component.html',
//   styleUrls: ['./trips.component.css']
// })
// export class TripsComponent implements OnInit {
//   trips: any[] = [];
//   drivers: any[] = [];
//   vehicles: any[] = [];

//   newTrip = {
//     driverId: 0,
//     vehicleId: 0,
//     startTime: new Date().toISOString().slice(0, 16),
//     endTime: null,
//     status: 'Active'
//   };

//   constructor(
//     private tripService: TripService,
//     private driverService: DriverService,
//     private vehicleService: VehicleService
//   ) {}

//   ngOnInit(): void {
//     this.loadData();
//   }

//   loadData(): void {
//     this.tripService.getTrips().subscribe({
//       next: data => this.trips = data,
//       error: err => console.error('Error loading trips', err)
//     });

//     this.driverService.getDrivers().subscribe({
//       next: data => this.drivers = data,
//       error: err => console.error('Error loading drivers', err)
//     });

//     this.vehicleService.getAvailableVehicles().subscribe({
//       next: data => this.vehicles = data,
//       error: err => console.error('Error loading vehicles', err)
//     });
//   }

//   addTrip(): void {
//     const payload = {
//       driverId: Number(this.newTrip.driverId),
//       vehicleId: Number(this.newTrip.vehicleId),
//       startTime: new Date(this.newTrip.startTime).toISOString(),
//       endTime: null,
//       status: this.newTrip.status
//     };

//     if (!payload.driverId || !payload.vehicleId) {
//       alert('Select both driver and vehicle');
//       return;
//     }

//     this.tripService.addTrip(payload).subscribe({
//       next: () => {
//         alert('Trip created successfully!');
//         this.newTrip = {
//           driverId: 0,
//           vehicleId: 0,
//           startTime: new Date().toISOString().slice(0, 16),
//           endTime: null,
//           status: 'Active'
//         };
//         this.loadData();
//       },
//       error: err => {
//         console.error('Error adding trip', err);
//         alert('Failed to add trip: ' + (err.error || err.message));
//       }
//     });
//   }

//   completeTrip(id: number): void {
//     this.tripService.completeTrip(id).subscribe({
//       next: () => {
//         alert('Trip marked as completed!');
//         this.loadData();
//       },
//       error: err => {
//         console.error('Error completing trip', err);
//         alert('Failed to complete trip');
//       }
//     });
//   }
// }
