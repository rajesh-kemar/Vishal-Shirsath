import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { TripListComponent } from './app/components/trip-list/trip-list.component';
import { TripFormComponent } from './app/components/trip-form/trip-form.component';

const routes: Routes = [
  { path: '', component: TripListComponent },
  { path: 'new', component: TripFormComponent }
];

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      HttpClientModule,
      RouterModule.forRoot(routes)
    )
  ]
}).catch(err => console.error(err));
