import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Driver } from '../../models/driver';
import { DriverService } from '../../services/driver.service';

@Component({
  selector: 'app-drivers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.css']
})
export class DriversComponent implements OnInit {
  drivers: Driver[] = [];
  selectedDriver: Driver | null = null;
  errorMessage: string = '';

  constructor(private driverService: DriverService) {}

  ngOnInit(): void {
    this.loadDrivers();
    this.selectedDriver = {
      driverId: 0,
      username: '',
      name: '',
      licenseNumber: '',
      phoneNumber: ''
    };
  }

  /** ✅ Safe loader handles object or array API responses */
  loadDrivers(): void {
    this.driverService.getDrivers().subscribe({
      next: (data: any) => {
        // Some APIs return { drivers: [...] } or { data: [...] }
        if (Array.isArray(data)) {
          this.drivers = data;
        } else if (Array.isArray(data.drivers)) {
          this.drivers = data.drivers;
        } else if (Array.isArray(data.Drivers)) {
          this.drivers = data.Drivers;
        } else {
          this.drivers = [];
          console.warn('Unexpected drivers response:', data);
        }
      },
      error: (err) => {
        console.error('Error loading drivers:', err);
        this.errorMessage = 'Failed to load drivers.';
      }
    });
  }

  editDriver(driver: Driver): void {
    this.selectedDriver = { ...driver };
  }

  updateDriver(): void {
    if (!this.selectedDriver) return;

    this.driverService.updateDriver(this.selectedDriver).subscribe({
      next: () => {
        alert('Driver updated successfully!');
        this.selectedDriver = {
          driverId: 0,
          username: '',
          name: '',
          licenseNumber: '',
          phoneNumber: ''
        };
        this.loadDrivers();
      },
      error: (err) => {
        console.error('Error updating driver:', err);
        this.errorMessage = 'Failed to update driver.';
      }
    });
  }

  deleteDriver(id: number): void {
    if (!confirm('Are you sure you want to delete this driver?')) return;

    this.driverService.deleteDriver(id).subscribe({
      next: () => {
        alert('Driver deleted successfully!');
        this.loadDrivers();
      },
      error: (err) => {
        console.error('Error deleting driver:', err);
        this.errorMessage = 'Failed to delete driver.';
      }
    });
  }
}
