// import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ApiService } from '../../services/api.service';
// import { Vehicle } from '../../models/vehicle.model';

// @Component({
//   selector: 'app-vehicle-selector',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './vehicle-selector.component.html',
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
//     this.apiService.getVehicles().subscribe((vehicles) => {
//       this.vehicles = vehicles.filter(v => v.status === 'available');
//       this.loading = false;
//     });
//   }

//   onVehicleChange(event: Event) {
//     const value = (event.target as HTMLSelectElement).value;
//     this.vehicleSelected.emit(Number(value));
//   }
// }
