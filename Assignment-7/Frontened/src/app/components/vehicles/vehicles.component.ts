import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehicleService } from '../../services/vehicle.service';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.css']
})
export class VehiclesComponent implements OnInit {
  vehicles: any[] = [];
  newVehicle = { vehicleNumber: '', type: '', capacity: null }; // removed isAvailable
  successMsg: string = '';

  constructor(private vehicleService: VehicleService) {}

  ngOnInit(): void {
    this.loadVehicles();
  }

  loadVehicles(): void {
    this.vehicleService.getVehicles().subscribe({
      next: (data: any[]) => this.vehicles = data,
      error: (err) => console.error('Error loading vehicles', err)
    });
  }

  addVehicle(): void {
    if (!this.newVehicle.vehicleNumber || !this.newVehicle.type || this.newVehicle.capacity === null) {
      alert('Please fill all required fields!');
      return;
    }

    this.vehicleService.addVehicle(this.newVehicle).subscribe({
      next: (res) => {
        this.successMsg = `Vehicle "${res.vehicleNumber}" added successfully!`;
        this.newVehicle = { vehicleNumber: '', type: '', capacity: null };
        this.loadVehicles();
      },
      error: (err) => console.error('Error adding vehicle', err)
    });
  }

  deleteVehicle(id: number): void {
    this.vehicleService.deleteVehicle(id).subscribe({
      next: () => this.loadVehicles(),
      error: (err) => console.error('Error deleting vehicle', err)
    });
  }
}
