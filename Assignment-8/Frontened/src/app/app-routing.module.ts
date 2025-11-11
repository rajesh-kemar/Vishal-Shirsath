import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DriversComponent } from './components/drivers/drivers.component';
import { VehiclesComponent } from './components/vehicles/vehicles.component';
import { TripsComponent } from './components/trips/trips.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Public
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Protected
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'drivers', component: DriversComponent, canActivate: [AuthGuard] },
  { path: 'vehicles', component: VehiclesComponent, canActivate: [AuthGuard] },
  { path: 'trips', component: TripsComponent, canActivate: [AuthGuard] },

  // Wildcard fallback
  { path: '**', redirectTo: '/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}























































// // src/app/app-routing.module.ts
// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';
// import { LoginComponent } from './components/auth/login/login.component';
// import { DashboardComponent } from './components/dispatcher/dashboard/dashboard.component';
// import { DriverDashboardComponent } from './components/driver/dashboard/dashboard.component';
// import { AuthGuard } from './guards/auth.guard';

// const routes: Routes = [
//   // 🔹 Default route → Login Page
//   { path: '', component: LoginComponent },

//   // 🔹 Dispatcher Dashboard (protected)
//   { path: 'dispatcher/dashboard', component: DashboardComponent, canActivate: [AuthGuard] },

//   // 🔹 Driver Dashboard (protected)
//   { path: 'driver/dashboard', component: DriverDashboardComponent, canActivate: [AuthGuard] },

//   // 🔹 Wildcard route (anything else → redirect to login)
//   { path: '**', redirectTo: '' }
// ];

// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule]
// })
// export class AppRoutingModule {}
