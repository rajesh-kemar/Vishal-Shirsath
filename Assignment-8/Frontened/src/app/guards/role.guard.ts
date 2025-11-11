import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['role'];
    const user = this.auth.getUser();

    if (!user || !user.role) {
      this.router.navigate(['/login']);
      return false;
    }

    // expectedRole can be string or array
    if (Array.isArray(expectedRole)) {
      if (expectedRole.includes(user.role)) return true;
    } else {
      if (user.role === expectedRole) return true;
    }

    // not authorized
    this.router.navigate(['/unauthorized']);
    return false;
  }
}
