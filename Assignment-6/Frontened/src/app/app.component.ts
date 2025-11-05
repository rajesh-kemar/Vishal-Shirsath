import { Component } from '@angular/core';
import { TripFormComponent } from './components/trip-form/trip-form.component';
import { TripListComponent } from './components/trip-list/trip-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TripFormComponent, TripListComponent],
  template: `
    <div class="container">
      <h1 class="my-3 text-center">Trip Management</h1>
      <div class="row">
        <div class="col-md-4">
          <app-trip-form></app-trip-form>
        </div>
        <div class="col-md-8">
          <app-trip-list></app-trip-list>
        </div>
      </div>
    </div>
  `
})
export class AppComponent {}
