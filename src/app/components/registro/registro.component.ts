import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CustomValidators } from '../../validators/custom-validators';
interface User {
  username: string;
  password: string;
  email: string;
  birthday: string;
}
@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})

export class RegistroComponent {

  user: User = {
    username: '',
    password: '',
    email: '',
    birthday: ''
  };

  confirmPassword: string = '';
  registrationFailed: boolean = false;
  registrationSuccess: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  // Getter to check if passwords match
  get passwordMismatch(): boolean {
    return this.user.password !== this.confirmPassword;
  }

  // Handle form submission
  onRegister(): void {
    this.registrationFailed = false;
    this.registrationSuccess = false;

    if (this.passwordMismatch) {
      // Do not proceed if passwords do not match
      return;
    }

    const success = this.authService.register(this.user);

    if (success) {
      this.registrationSuccess = true;
      // Optionally, navigate to login or another page
      // this.router.navigate(['/login']);
      // Reset form fields
      this.user.username = '';
      this.user.password = '';
      this.user.email = '';
      this.user.birthday = '';
      this.confirmPassword = '';
    } else {
      this.registrationFailed = true;
    }
  }

  onReset(): void {
    this.user.username = '';
    this.user.email = '';
    this.user.birthday = '';
    this.user.password = '';
    this.confirmPassword = '';
    this.registrationFailed = false;
    this.registrationSuccess = false;
  }
}
