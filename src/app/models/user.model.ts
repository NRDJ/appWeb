export interface User {
    username: string;
    password: string;
    email: string;
    birthday?: string; // Optional property for birthday
    role?: string; // Optional property for role
  }