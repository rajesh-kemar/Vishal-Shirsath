import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DriversComponent } from './components/drivers/drivers.component';
import { VehiclesComponent } from './components/vehicles/vehicles.component';
import { TripsComponent } from './components/trips/trips.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'drivers', component: DriversComponent },
  { path: 'vehicles', component: VehiclesComponent },
  { path: 'trips', component: TripsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
