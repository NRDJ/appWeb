import { Injectable } from '@angular/core';

interface User {
  username: string;
  password: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor() { }

  // Retrieve users from LocalStorage
  private getUsers(): User[] {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  }

  // Save users to LocalStorage
  private saveUsers(users: User[]): void {
    localStorage.setItem('users', JSON.stringify(users));
  }

  // Register a new user
  register(user: User): boolean {
    const users = this.getUsers();

    // Check if username already exists
    const userExists = users.find(u => u.username === user.username);
    if (userExists) {
      return false; // Registration failed
    }

    // Check if username already exists
    const emailExists = users.find(u => u.email === user.email);
    if (emailExists) {
      return false; // Registration failed
    }

    // Add new user
    users.push(user);
    this.saveUsers(users);
    return true; // Registration successful
  }

  // (Optional) Additional methods like login can be added here
}