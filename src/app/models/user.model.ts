export interface User {
  username: string;
  email: string;
  password: string;
  birthday?: string;
  role: 'patient' | 'doctor'; // Add role property
}