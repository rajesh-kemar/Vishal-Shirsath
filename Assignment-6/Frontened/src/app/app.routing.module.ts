import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TripListComponent } from './components/trip-list/trip-list.component';
import { TripFormComponent } from './components/trip-form/trip-form.component';

export const routes: Routes = [   // ✅ export it
  { path: '', component: TripListComponent },
  { path: 'create-trip', component: TripFormComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
