export interface Trip {
  tripId: number;
  id: number;
  source: string;
  destination: string;
  startTime: string;
  endTime: string;
  status: string;
  vehicleId?: number;
  driverId?: number;
}
