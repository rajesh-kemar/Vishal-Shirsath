import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Trip } from '../../models/trip';
import { TripService } from '../../services/trip.service';
import { AuthService } from '../../services/auth.service';
import { VehicleService } from '../../services/vehicle.service';
import { Driver } from '../../models/driver';
import { DriverService } from '../../services/driver.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  trips: Trip[] = [];
  role: string | null = null;
  username: string | null = null;
  driver: Driver | null = null;

  // Dispatcher summary
  activeTrips: number = 0;
  completedTrips: number = 0;
  availableVehicles: number = 0;

  // Driver summary
  driverActiveTrips: number = 0;
  driverCompletedTrips: number = 0;
  totalHoursDriven: number = 0;

  errorMessage: string = '';

  constructor(
    private tripService: TripService,
    private auth: AuthService,
    private vehicleService: VehicleService,
    private driverService: DriverService
  ) {}

  ngOnInit(): void {
    this.role = this.auth.getRole();
    this.username = this.auth.getUsername();

    console.log('Dashboard Init => Role:', this.role, 'Username:', this.username);

    if (this.role === 'driver' && this.username) {
      this.loadDriverData(this.username);
    } else if (this.role === 'dispatcher') {
      this.loadDispatcherData();
    }
  }

  // Dispatcher: load trips summary and available vehicles
  loadDispatcherData(): void {
    this.tripService.getTrips().subscribe({
      next: (res: Trip[] | any) => {
        const tripsArray: Trip[] = Array.isArray(res) ? res : res.trips || res.Trips || [];
        this.trips = tripsArray;

        this.activeTrips = tripsArray.filter(t => t.status?.toLowerCase() === 'active').length;
        this.completedTrips = tripsArray.filter(t => t.status?.toLowerCase() === 'completed').length;

        console.log('Dispatcher Trips:', tripsArray);
      },
      error: err => {
        console.error('Error loading trips:', err);
        this.errorMessage = 'Failed to load trips.';
      }
    });

    this.vehicleService.getVehicles().subscribe({
      next: (res: any) => {
        const vehiclesArray: any[] = Array.isArray(res) ? res : res.vehicles || res.Vehicles || [];
        this.availableVehicles = vehiclesArray.filter(v => v.isAvailable).length;
        console.log('Available vehicles:', this.availableVehicles);
      },
      error: err => {
        console.error('Error loading vehicles:', err);
        this.availableVehicles = 0;
      }
    });
  }

  // Driver: load driver info and trips
  loadDriverData(username: string): void {
    this.driverService.getDrivers().subscribe({
      next: (drivers: Driver[]) => {
        console.log('Drivers array:', drivers);

        const normalizedUsername = username.trim().toLowerCase();

        const matchedDriver = drivers.find(d =>
          d.name?.trim().toLowerCase() === normalizedUsername ||
          normalizedUsername.includes(d.name?.trim().toLowerCase() || '') ||
          d.name?.trim().toLowerCase().includes(normalizedUsername)
        );

        if (!matchedDriver) {
          this.errorMessage = 'No driver match found';
          console.warn('No driver match found for username:', username);
          return;
        }

        this.driver = matchedDriver;
        console.log('Matched driver:', this.driver);

        this.tripService.getTrips().subscribe({
          next: (res: Trip[] | any) => {
            const tripsArray: Trip[] = Array.isArray(res) ? res : res.trips || res.Trips || [];

            // ✅ Filter trips by driverName
            const driverTrips = tripsArray.filter(
              t => t.driverName?.trim().toLowerCase() === this.driver?.name?.trim().toLowerCase()
            );

            this.driverActiveTrips = driverTrips.filter(t => t.status?.toLowerCase() === 'active').length;
            this.driverCompletedTrips = driverTrips.filter(t => t.status?.toLowerCase() === 'completed').length;

            // Calculate total hours
            this.totalHoursDriven = driverTrips.reduce((total, trip) => {
              if (trip.startTime && trip.endTime) {
                const start = new Date(trip.startTime).getTime();
                const end = new Date(trip.endTime).getTime();
                const hours = (end - start) / (1000 * 60 * 60);
                return total + (hours > 0 ? hours : 0);
              }
              return total;
            }, 0);

            console.log('Driver Trips:', driverTrips);
            console.log('Driver Total Hours:', this.totalHoursDriven);
          },
          error: err => console.error('Error fetching trips for driver:', err)
        });
      },
      error: err => console.error('Error loading driver info:', err)
    });
  }
}
