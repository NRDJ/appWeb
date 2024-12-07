import { Injectable } from '@angular/core';
import { User } from '../models/user.model'; // Adjust the import according to your project structure
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usersKey = 'users';
  private loggedInUserKey = 'loggedInUser';

  constructor() {}

  // Retrieve users from LocalStorage
  private getUsers(): User[] {
    const users = localStorage.getItem(this.usersKey);
    return users ? JSON.parse(users) : [];
  }

  // Save users to LocalStorage
  private saveUsers(users: User[]): void {
    localStorage.setItem(this.usersKey, JSON.stringify(users));
  }

  // Register a new user
  register(user: User): boolean {
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
}