import { Injectable } from '@angular/core';
import { User } from '../models/user.model'; // Adjust the import according to your project structure
@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private usersKey = 'users';
  public loggedInUserKey = 'loggedInUser';

  constructor() {
    // Initialize with two doctor users if not already present
    const users = this.getUsers();
    if (users.length === 0) {
      this.saveUsers([
        { username: 'doctor1', email: 'doctor1@gmail.com', password: '!123Password123!', role: 'doctor' },
        { username: 'doctor2', email: 'doctor2@gmail.com', password: '!123Password123!', role: 'doctor' }
      ]);
    }
  }

  // Retrieve users from LocalStorage
  public getUsers(): User[] {
    const users = localStorage.getItem(this.usersKey);
    return users ? JSON.parse(users) : [];
  }

  // Save users to LocalStorage
  public saveUsers(users: User[]): void {
    localStorage.setItem(this.usersKey, JSON.stringify(users));
  }

  // Register a new user
  public register(user: User): boolean {
    const users = this.getUsers();

    // Check if username already exists
    const userExists = users.find(u => u.username === user.username);
    if (userExists) {
      return false; // Registration failed
    }

    // Check if email already exists
    const emailExists = users.find(u => u.email === user.email);
    if (emailExists) {
      return false; // Registration failed
    }

    // Add new user
    users.push(user);
    this.saveUsers(users);
    return true; // Registration successful
  }

  // Login a user
  login(email: string, password: string): boolean {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem(this.loggedInUserKey, JSON.stringify(user));
      return true; // Login successful
    }
    return false; // Login failed
  }

  // Logout a user
  logout(): void {
    localStorage.removeItem(this.loggedInUserKey);
  }

  // Get the logged-in user
  getLoggedInUser(): User | null {
    const user = localStorage.getItem(this.loggedInUserKey);
    return user ? JSON.parse(user) : null;
  }

    // Check if a user is logged in
    public isLoggedIn(): boolean {
      return this.getLoggedInUser() !== null;
    }

    // Get all doctors
    public getDoctors(): User[] {
      const users = this.getUsers();
      return users.filter(user => user.role === 'doctor');
    }
}