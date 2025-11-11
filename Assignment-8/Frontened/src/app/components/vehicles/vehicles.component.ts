import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehicleService } from '../../services/vehicle.service';
import { Vehicle } from '../../models/vehicle';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.css']
})
export class VehiclesComponent implements OnInit {
  vehicles: Vehicle[] = [];
  newVehicle: Partial<Vehicle> = {
    vehicleNumber: '',
    type: '',
    capacity: 0,
    isAvailable: true
  };

  selectedVehicleId: number | null = null;
  successMsg = '';
  errorMsg = '';
  isLoading = false;

  constructor(private vehicleService: VehicleService) {}

  ngOnInit(): void {
    this.loadVehicles();
  }

  /** 🔹 Load all vehicles */
  loadVehicles(): void {
    this.isLoading = true;
    this.vehicleService.getVehicles().subscribe({
      next: (data: any) => {
        console.log('Vehicles API response:', data);

        // ✅ Handle both array or wrapped object
        let vehiclesArray: Vehicle[] = [];
        if (Array.isArray(data)) {
          vehiclesArray = data;
        } else if (data.vehicles || data.Vehicles) {
          vehiclesArray = data.vehicles || data.Vehicles;
        }

        this.vehicles = vehiclesArray.map(v => ({
          ...v,
          availability: v.isAvailable ? 'Available' : 'Unavailable'
        }));

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading vehicles:', err);
        this.errorMsg = '❌ Failed to load vehicles. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  /** 🔹 Add or Update vehicle */
  addOrUpdateVehicle(): void {
    this.successMsg = '';
    this.errorMsg = '';

    if (
      !this.newVehicle.vehicleNumber?.trim() ||
      !this.newVehicle.type?.trim() ||
      this.newVehicle.capacity == null
    ) {
      this.errorMsg = '⚠️ All fields are required!';
      return;
    }

    if (this.selectedVehicleId) {
      // ✅ Update vehicle
      this.vehicleService.updateVehicle(this.selectedVehicleId, this.newVehicle).subscribe({
        next: () => {
          this.successMsg = '✅ Vehicle updated successfully!';
          this.resetForm();
          this.loadVehicles();
        },
        error: (err) => {
          console.error('Error updating vehicle:', err);
          this.errorMsg = '❌ Failed to update vehicle. Please try again.';
        }
      });
    } else {
      // ✅ Add new vehicle
      this.vehicleService.addVehicle(this.newVehicle).subscribe({
        next: (res: Vehicle) => {
          this.successMsg = `✅ Vehicle "${res.vehicleNumber}" added successfully!`;
          this.resetForm();
          this.loadVehicles();
        },
        error: (err) => {
          console.error('Error adding vehicle:', err);
          this.errorMsg = '❌ Failed to add vehicle. Please try again.';
        }
      });
    }
  }

  /** 🔹 Edit vehicle */
  editVehicle(vehicle: Vehicle): void {
    this.selectedVehicleId = vehicle.vehicleId!;
    this.newVehicle = { ...vehicle };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /** 🔹 Delete vehicle */
  deleteVehicle(vehicleId: number): void {
    if (!confirm('Are you sure you want to delete this vehicle?')) return;

    this.vehicleService.deleteVehicle(vehicleId).subscribe({
      next: () => {
        this.successMsg = '🗑️ Vehicle deleted successfully!';
        this.loadVehicles();
      },
      error: (err) => {
        console.error('Error deleting vehicle:', err);
        this.errorMsg = '❌ Failed to delete vehicle. Please try again.';
      }
    });
  }

  /** 🔹 Reset form */
  private resetForm(): void {
    this.newVehicle = {
      vehicleNumber: '',
      type: '',
      capacity: 0,
      isAvailable: true
    };
    this.selectedVehicleId = null;
  }
}
