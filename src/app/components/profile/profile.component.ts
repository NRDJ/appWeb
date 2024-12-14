// src/app/components/profile/profile.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import { Hora } from '../../models/hora.model';
import { FirestoreService } from '../../services/firestore.service';

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

  constructor(
    private authService: AuthService, 
    private router: Router,
    private firestoreService: FirestoreService) {}

  
  documents: any[] = [];
  date: string = '';
  time: string = '';
  doctor: string = '';

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

  // Fields for editing an existing document
  selectedDocument: any = null;  // will hold the document object to be edited
  editNombre: string = '';
  editEdad: string = '';
  editFechaNacimiento: string = '';

  ngOnInit(): void {
    this.getDocuments();
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

  // Create a document with user-input data
  createDocument(form: any): void {
    const data = { 
      date: form.value.fecha,
      time: form.value.hora,
      doctor: this.selectedDoctor,
    };

    this.firestoreService.createDocument('horas', data).then(() => {
      console.log('Document created');
      this.date = '';
      this.time = '';
      this.doctor = '';
      this.getDocuments();
    });
  }

  // Get documents from the 'todos' collection
  getDocuments(): void {
    this.firestoreService.getDocuments('todos').subscribe((documents) => {
      this.documents = documents;
    });
  }

   // Select a document for editing
   selectDocument(doc: any): void {
    this.selectedDocument = doc;
    // Copy current values into our edit fields
    this.editNombre = doc.nombre;
    this.editEdad = doc.edad;
    this.editFechaNacimiento = doc.fechaNacimiento;
  }

  // Cancel editing
  cancelEdit(): void {
    this.selectedDocument = null;
    this.editNombre = '';
    this.editEdad = '';
    this.editFechaNacimiento = '';
  }

  // Save changes to the selected document
  saveEdit(): void {
    if (!this.selectedDocument) return;

    const updatedData = {
      nombre: this.editNombre,
      edad: this.editEdad,
      fechaNacimiento: this.editFechaNacimiento
    };

    this.firestoreService
      .updateDocument('todos', this.selectedDocument.id, updatedData)
      .then(() => {
        console.log('Document updated');
        // Clear editing state
        this.cancelEdit();
      });
    }

    // Delete a document
    deleteDocument(id: string): void {
      this.firestoreService.deleteDocument('todos', id).then(() => {
        console.log('Document deleted');
        this.getDocuments();
      });
    }

    // Getter to check if passwords match
    get passwordMismatch(): boolean {
      return this.user.password !== this.confirmPassword;
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

  
  }

