// src/app/models/trip.model.ts
export interface Trip {
  tripId?: number;
  driverId: number;
  driverName?: string;
  vehicleType: string;
  source: string;
  destination: string;
  startTime: string;
  endTime?: string;
  status: string;
  durationHours?: number;
  isExtended?: boolean;
}
