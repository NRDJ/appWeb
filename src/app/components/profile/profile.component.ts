import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User = {
    username: '',
    email: '',
    password: '',
    birthday: '',
    role: 'patient'
  };
  confirmPassword: string = '';
  updateSuccess: boolean = false;
  updateFailed: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

    // Getter to check if passwords match
    get passwordMismatch(): boolean {
      return this.user.password !== this.confirmPassword;
    }

  ngOnInit(): void {
    const loggedInUser = this.authService.getLoggedInUser();
    if (loggedInUser) {
      this.user = loggedInUser;
    } else {
      this.router.navigate(['/login']); // Redirect to login if not logged in
    }
  }

  onUpdateProfile(): void {
    this.updateSuccess = false;
    this.updateFailed = false;

    if (this.passwordMismatch) {
      // Do not proceed if passwords do not match
      return;
    }

    const users = this.authService.getUsers();
    const userIndex = users.findIndex(u => u.username === this.user.username);

    if (userIndex !== -1) {
      users[userIndex] = this.user;
      this.authService.saveUsers(users);
      localStorage.setItem(this.authService.loggedInUserKey, JSON.stringify(this.user));
      this.updateSuccess = true;
    } else {
      this.updateFailed = true;
    }
  }

  onReset(): void {
    const loggedInUser = this.authService.getLoggedInUser();
    if (loggedInUser) {
      this.user = loggedInUser;
      this.confirmPassword = '';
      this.updateSuccess = false;
      this.updateFailed = false;
    }
  }
}