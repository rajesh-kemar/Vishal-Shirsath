import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.auth.isLoggedIn()) {
      return true; // ✅ Allow access
    }

    this.router.navigate(['/login']); // ❌ Redirect to login
    return false;
  }
}


























































// // src/app/guards/auth.guard.ts
// import { Injectable } from '@angular/core';
// import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
// import { AuthService } from '../services/auth.service';

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthGuard implements CanActivate {
//   constructor(private authService: AuthService, private router: Router) {}

//   canActivate(route: ActivatedRouteSnapshot): boolean {
//     if (!this.authService.isLoggedIn()) {
//       this.router.navigate(['/login']);
//       return false;
//     }

//     const expectedRole = route.data['role'];
//     const userRole = this.authService.getRole();

//     if (expectedRole && expectedRole !== userRole) {
//       this.router.navigate(['/unauthorized']); // optional unauthorized page
//       return false;
//     }

//     return true;
//   }
// }
