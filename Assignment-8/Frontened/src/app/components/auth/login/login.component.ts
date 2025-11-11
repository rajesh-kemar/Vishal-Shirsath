import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      const role = this.authService.getRole();
      if (role === 'dispatcher') this.router.navigate(['/drivers']);
      else this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter username and password';
      return;
    }

    this.authService.login(this.username, this.password).subscribe({
      next: (response: any) => {
        const role = response.role.toLowerCase();
        localStorage.setItem('token', response.token);
        localStorage.setItem('username', this.username);
        localStorage.setItem('password', this.password); // ✅ required for prefill
        localStorage.setItem('role', role);

        if (role === 'dispatcher') this.router.navigate(['/drivers']);
        else this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.errorMessage = 'Invalid username or password';
      },
    });
  }
}
