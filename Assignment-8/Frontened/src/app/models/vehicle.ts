// src/app/models/vehicle.ts
export interface Vehicle {
  vehicleId: number;          // Unique ID from backend
  vehicleNumber: string;      // Example: MH12AB1234
  type: string;               // Example: Truck, Van
  capacity: number;           // Capacity in tons or units
  isAvailable: boolean;       // True = Available, False = In Use
  availability?: string;      // Optional display string like "Available" | "In Use"
}
