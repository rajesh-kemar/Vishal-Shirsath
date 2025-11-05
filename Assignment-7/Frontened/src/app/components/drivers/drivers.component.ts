import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DriverService } from '../../services/driver.service';

@Component({
  selector: 'app-drivers', // corrected selector
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './drivers.component.html', // corrected template file
  styleUrls: ['./drivers.component.css']
})
export class DriversComponent implements OnInit {
  drivers: any[] = [];
  newDriver = { name: '', licenseNumber: '', phoneNumber: '' };

  constructor(private driverService: DriverService) {}

  ngOnInit(): void {
    this.loadDrivers();
  }

  loadDrivers(): void {
    this.driverService.getDrivers().subscribe({
      next: (data: any[]) => this.drivers = data,
      error: (err) => console.error('Error fetching drivers', err)
    });
  }

  addDriver(): void {
    if (!this.newDriver.name || !this.newDriver.licenseNumber || !this.newDriver.phoneNumber) {
      alert('Please fill all fields');
      return;
    }

    this.driverService.addDriver(this.newDriver).subscribe({
      next: () => {
        this.newDriver = { name: '', licenseNumber: '', phoneNumber: '' };
        this.loadDrivers();
      },
      error: (err) => console.error('Error adding driver', err)
    });
  }

  deleteDriver(id: number): void {
    this.driverService.deleteDriver(id).subscribe({
      next: () => this.loadDrivers(),
      error: (err) => console.error('Error deleting driver', err)
    });
  }
}
