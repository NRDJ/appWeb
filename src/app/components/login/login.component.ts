import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  loginFailed: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    this.loginFailed = false;

    const success = this.authService.login(this.email, this.password);

    if (success) {
      this.router.navigate(['/profile']); // Redirect to home or another page
    } else {
      this.loginFailed = true;
    }
  }
}