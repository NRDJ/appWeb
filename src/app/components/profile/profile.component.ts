import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import { ScheduleService } from '../../services/schedule.service';

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
  activeCard: string = '';
  doctors: User[] = [];
  selectedDoctor: User | null = null;
  hours: any[] = []; // Array to store scheduled hours

  constructor(private authService: AuthService, 
    private scheduleService: ScheduleService, 
    private router: Router
  ) {}

    // Getter to check if passwords match
    get passwordMismatch(): boolean {
      return this.user.password !== this.confirmPassword;
    }

  ngOnInit(): void {
    const loggedInUser = this.authService.getLoggedInUser();
    if (loggedInUser) {
      this.user = loggedInUser;
      if (this.user.role === 'patient') {
        this.doctors = this.authService.getDoctors();
      }
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

  setActiveCard(card: string): void {
    this.activeCard = this.activeCard === card ? '' : card;
  }

  // Load scheduled hours
  loadHours(): void {
    this.scheduleService.getHours().subscribe(hours => {
      this.hours = hours;
    });
  }

    // Schedule a new hour
  scheduleHour(form: any): void {
    const newHour = {
      patient: this.user.username,
      doctor: this.selectedDoctor?.username,
      date: form.value.fecha,
      time: form.value.hora
    };

    this.scheduleService.addHour(newHour).subscribe(() => {
      this.loadHours(); // Reload hours after scheduling
      this.setActiveCard(''); // Close the form
    });
  }

  // Delete an hour
  deleteHour(id: string): void {
    this.scheduleService.deleteHour(id).subscribe(() => {
      this.loadHours(); // Reload hours after deletion
    });
  }

  // Edit an hour
  editHour(id: string, updatedHour: any): void {
    this.scheduleService.updateHour(id, updatedHour).subscribe(() => {
      this.loadHours(); // Reload hours after editing
    });
  }
}