import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TripService } from '../../services/trip.service';
import { VehicleService } from '../../services/Vehicle.service';
import { Trip } from '../../models/trip.model';

@Component({
  selector: 'app-trip-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="form-wrapper">
      <div class="card trip-card shadow-sm">
        <h3 class="text-center mb-4 trip-title">Create Trip</h3>
        <form [formGroup]="tripForm" (ngSubmit)="createTrip()">

          <!-- Vehicle -->
          <div class="mb-3">
            <label class="form-label">Vehicle</label>
            <select class="form-select" formControlName="vehicleId">
              <option value="">Select Vehicle</option>
              <option *ngFor="let v of vehicles" [value]="v.vehicleId">
                {{ v.numberPlate }} ({{ v.type }})
              </option>
            </select>
            <small class="text-danger" *ngIf="tripForm.get('vehicleId')?.invalid && tripForm.get('vehicleId')?.touched">
              Vehicle selection is required.
            </small>
          </div>

          <!-- Driver ID -->
          <div class="mb-3">
            <label class="form-label">Driver ID</label>
            <input type="number" class="form-control" formControlName="driverId" min="1">
          </div>

          <!-- Source -->
          <div class="mb-3">
            <label class="form-label">Source</label>
            <input type="text" class="form-control" formControlName="source">
          </div>

          <!-- Destination -->
          <div class="mb-3">
            <label class="form-label">Destination</label>
            <input type="text" class="form-control" formControlName="destination">
          </div>

          <!-- Start Time -->
          <div class="mb-3">
            <label class="form-label">Start Time</label>
            <input type="datetime-local" class="form-control" formControlName="startTime">
          </div>

          <!-- End Time -->
          <div class="mb-3">
            <label class="form-label">End Time</label>
            <input type="datetime-local" class="form-control" formControlName="endTime">
          </div>

          <!-- Status -->
          <div class="mb-3">
            <label class="form-label">Status</label>
            <select class="form-select" formControlName="status">
              <option>Scheduled</option>
              <option>in-progress</option>
              <option>available</option>
            </select>
          </div>

          <div class="text-center mt-4">
            <button type="submit" class="btn btn-primary w-100" [disabled]="tripForm.invalid">
              Create Trip
            </button>
          </div>

        </form>
      </div>
    </div>
  `,
  styles: [`
    /* Center horizontally, near top vertically */
    .form-wrapper {
      display: flex;
      justify-content: center;
      margin-top: 50px; /* Adjust to move form closer to top */
    }

    /* Card styling */
    .trip-card {
      width: 400px;
      background-color: #ffffff;
      border-radius: 15px;
      padding: 25px 20px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      border-top: 4px solid #0d6efd; /* top accent */
    }

    /* Title styling */
    .trip-title {
      font-weight: 600;
      color: #0d6efd;
    }

    /* Label styling */
    label.form-label {
      font-weight: 500;
    }

    /* Input and select styling */
    input.form-control, select.form-select {
      border-radius: 6px;
      border: 1px solid #ced4da;
      transition: 0.3s all;
    }

    input.form-control:focus, select.form-select:focus {
      border-color: #0d6efd;
      box-shadow: 0 0 5px rgba(13, 110, 253, 0.3);
      outline: none;
    }

    /* Error messages */
    small.text-danger {
      font-size: 0.85rem;
    }

    /* Button hover */
    .btn-primary:hover {
      background-color: #0b5ed7;
      border-color: #0b5ed7;
    }
  `]
})
export class TripFormComponent implements OnInit {
  tripForm: FormGroup;
  vehicles: any[] = [];

  constructor(
    private fb: FormBuilder,
    private tripService: TripService,
    private vehicleService: VehicleService
  ) {
    this.tripForm = this.fb.group({
      vehicleId: ['', Validators.required],
      driverId: ['', [Validators.required, Validators.min(1)]],
      source: ['', Validators.required],
      destination: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      status: ['Scheduled', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadAvailableVehicles();
  }

  loadAvailableVehicles(): void {
    this.vehicleService.getAvailableVehicles().subscribe({
      next: (data) => this.vehicles = data,
      error: (err) => console.error('Error fetching vehicles:', err)
    });
  }

  createTrip(): void {
    if (this.tripForm.valid) {
      const newTrip: Trip = this.tripForm.value;
      this.tripService.createTrip(newTrip).subscribe({
        next: () => {
          alert('✅ Trip created successfully');
          this.tripForm.reset({ status: 'Scheduled' });
        },
        error: (err) => console.error('Error creating trip:', err)
      });
    }
  }
}






















































































