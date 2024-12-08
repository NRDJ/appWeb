import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CustomValidators } from '../../validators/custom-validators'; // Adjust the import according to your project structure

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.css']
})
export class PasswordRecoveryComponent {
  email: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  recoveryFailed: boolean = false;
  recoverySuccess: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  // Getter to check if passwords match
  get passwordMismatch(): boolean {
    return this.newPassword !== this.confirmPassword;
  }

  onRecoverPassword(): void {
    this.recoveryFailed = false;
    this.recoverySuccess = false;

    if (this.passwordMismatch) {
      return;
    }

    const users = this.authService.getUsers();
    const userIndex = users.findIndex(u => u.email === this.email);

    if (userIndex !== -1) {
      users[userIndex].password = this.newPassword;
      this.authService.saveUsers(users);
      this.recoverySuccess = true;
      this.router.navigate(['/login']);
    } else {
      this.recoveryFailed = true;
    }
  }
}