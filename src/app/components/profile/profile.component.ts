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
  successMessage: string = '';

  // Fields for editing an existing document
  selectedDocument: any = null;  // will hold the document object to be edited
  editNombre: string = '';
  editEdad: string = '';
  editFechaNacimiento: string = '';

  // Tracks the row being edited
  editingHour: any = null;


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

    this.firestoreService.createDocument('horas', data)
      .then(() => {
        console.log('Document created');
        this.successMessage = 'Hora agendada exitosamente.'; // Set success message
        this.errorMessage = ''; // Reset error message
        this.date = '';
        this.time = '';
        this.selectedDoctor = ''; // Reset selected doctor
        this.getDocuments(); // Refresh documents list
      })
      .catch((error) => {
        console.error('Error creating document:', error);
        this.errorMessage = 'Hubo un problema al agendar la hora. Intenta nuevamente.'; // Set error message
        this.successMessage = ''; // Reset success message
      });
  }

  // Get documents from the 'horas' collection
  getDocuments(): void {
    this.firestoreService.getDocuments('horas').subscribe((documents) => {
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


  // Delete a document
  deleteDocument(id: string): void {
    const confirmation = window.confirm('¿Estás seguro de que quieres cancelar esta hora? Una vez cancelada, no se podrá recuperar.');

    if (confirmation) {
      this.firestoreService.deleteDocument('horas', id)
        .then(() => {
          this.successMessage = 'Hora cancelada exitosamente.';
          this.errorMessage = '';
          this.getDocuments();
        })
        .catch((error) => {
          console.error('Error al cancelar la hora:', error);
          this.errorMessage = 'Hubo un problema al cancelar la hora. Intenta nuevamente.';
          this.successMessage = '';
        });
    } else {
      console.log('Cancelación de la hora cancelada por el usuario.');
    }
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

    // Inline editing: Step 1 - Enter edit mode for a specific row
  editHour(hour: any): void {
    // Optionally clone it if you want to revert changes on cancel without re-fetch
    // For simplicity, we modify `hour` directly
    this.editingHour = { ...hour };  // store a copy in editingHour
  }

  // Step 2 - Save changes to Firestore
  saveEdit(hour: any): void {
    // If you are directly binding hour in the HTML, `hour` is already updated.
    // But we've made a local copy in `editingHour`, so let's update using that.
    this.firestoreService.updateDocument('horas', hour.id, {
      date: hour.date,
      time: hour.time,
      doctor: hour.doctor
    }).then(() => {
      console.log('Document updated');
      this.editingHour = null; // exit edit mode
      this.getDocuments();     // refresh the list
    });
  }

  // Step 3 - Cancel editing
  cancelEdit(): void {
    this.editingHour = null;
    this.getDocuments(); // re-fetch to discard unsaved changes
  }

  
  }

