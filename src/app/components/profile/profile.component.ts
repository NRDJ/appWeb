// src/app/components/profile/profile.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import { Hora } from '../../models/hora.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent{
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
    private router: Router
  ) {}

    // Getter to check if passwords match
    get passwordMismatch(): boolean {
      return this.user.password !== this.confirmPassword;
    }

    setActiveCard(card: string): void {
      this.activeCard = this.activeCard === card ? '' : card;
    }
}
