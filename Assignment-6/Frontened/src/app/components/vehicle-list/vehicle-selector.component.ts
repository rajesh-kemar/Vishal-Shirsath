// import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ApiService } from '../../services/api.service';
// import { Vehicle } from '../../models/vehicle.model';

// @Component({
//   selector: 'app-vehicle-selector',
//   standalone: true,
//   imports: [CommonModule],
//   template: `
//     <label>Select Vehicle:</label>
//     <select [value]="selectedVehicleId || ''" (change)="onVehicleChange($event)">
//       <option value="" disabled>Select a vehicle</option>
//       <option *ngFor="let vehicle of vehicles" [value]="vehicle.id">
//         {{ vehicle.name }}
//       </option>
//     </select>
//   `,
//   styleUrls: ['./vehicle-selector.component.css']
// })
// export class VehicleSelectorComponent implements OnInit {
//   @Input() selectedVehicleId: number | null = null;
//   @Output() vehicleSelected = new EventEmitter<number>();

//   vehicles: Vehicle[] = [];
//   loading = false;

//   constructor(private apiService: ApiService) {}

//   ngOnInit(): void {
//     this.loading = true;
//     this.apiService.getVehicles().subscribe({
//       next: (vehicles) => {
//         this.vehicles = vehicles; // no filter on 'available' if not in model
//         this.loading = false;
//       },
//       error: (err) => {
//         console.error('Failed to load vehicles', err);
//         this.loading = false;
//       }
//     });
//   }

//   onVehicleChange(event: Event) {
//     const value = (event.target as HTMLSelectElement).value;
//     this.vehicleSelected.emit(Number(value));
//   }
// }
