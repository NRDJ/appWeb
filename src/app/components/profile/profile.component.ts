// src/app/components/profile/profile.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import { ScheduleService } from '../../services/schedule.service';
import { Hora } from '../../models/hora.model';

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
  selectedDoctor: string = '';
  hours: Hora[] = []; // Array to store scheduled hours
  newHora: Hora = { id: '', date: '', time: '', doctor: '' }; // Initialize newHora
  isLoading: boolean = false;
  uploadStatus: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService, 
    private scheduleService: ScheduleService, 
    private router: Router
  ) {}

  // Getter to check if passwords match
  get passwordMismatch(): boolean {
    return this.user.password !== this.confirmPassword;
  }

  ngOnInit(): void {
    this.loadHoras();
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
  loadHoras(): void {
    this.scheduleService.getHours().subscribe((hours: Hora[]) => {
      this.hours = hours.map(hour => ({
        id: hour.id, // Ensure id is included
        date: hour.date,
        time: hour.time,
        doctor: hour.doctor
      }));
    });
  }

// Schedule a new hora
scheduleHour(form: any): void {
  const newHour: Hora = {
    id: '', // Ensure an ID is included if necessary
    date: form.value.fecha,
    time: form.value.hora,
    doctor: this.selectedDoctor
  };
  console.log('Nueva hora:', newHour);

  // Subscribe to the observable returned by addHour
  this.scheduleService.addHour(newHour).subscribe(
    () => {
      console.log("Justo antes de load horas");
      this.loadHoras(); // Reload hours after scheduling
      console.log("Justo despues de load horas");
      this.setActiveCard(''); // Close the form
    },
    error => {
      console.error('Error al agendar hora:', error);
    }
  );
}

  // Delete an hour
  deleteHour(hour: Hora): void {
    this.scheduleService.deleteHour(hour).subscribe(() => {
      this.loadHoras(); // Reload hours after deletion
    }, error => {
      console.error('Error al cancelar hora:', error);
    });
  }

  // Edit an hour
  editHour(id: string, updatedHour: Hora): void {
    this.scheduleService.updateHour(id, updatedHour).subscribe(() => {
      this.loadHoras(); // Reload hours after editing
    }, error => {
      console.error('Error al editar hora:', error);
    });
  }
}
