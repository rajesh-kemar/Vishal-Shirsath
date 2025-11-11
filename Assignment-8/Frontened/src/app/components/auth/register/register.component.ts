import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  name = '';
  licenseNumber = '';
  phoneNumber = '';
  username = '';
  password = '';
  role: string = 'driver'; // default

  constructor(private authService: AuthService, private router: Router) {}

  onRoleChange(event: any) {
    this.role = event.target.value;
  }

  onSubmit() {
    if (!this.username || !this.password) {
      alert('Please enter username and password');
      return;
    }

    // ✅ If driver, require full details
    if (this.role === 'driver' && !this.name) {
      alert('Please enter your name for driver registration');
      return;
    }

    const userData: any = {
      username: this.username,
      password: this.password,
      role: this.role,
    };

    if (this.role === 'driver') {
      userData.name = this.name;
      userData.licenseNumber = this.licenseNumber;
      userData.phoneNumber = this.phoneNumber;
    }

    // ✅ Call AuthService.registerDriver (works for both)
    this.authService.registerDriver(userData).subscribe({
      next: (res) => {
        alert(`${this.role} registered successfully! Please login.`);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error(err);
        alert('Error registering user.');
      },
    });
  }
}
