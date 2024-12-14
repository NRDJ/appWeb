import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.css']
})

export class ExampleComponent implements OnInit {
  documents: any[] = [];
  nuevoNombre: string = '';
  nuevaEdad: string = '';
  nuevaFechaNacimiento: string = '';

    // Fields for editing an existing document
    selectedDocument: any = null;  // will hold the document object to be edited
    editNombre: string = '';
    editEdad: string = '';
    editFechaNacimiento: string = '';

  constructor(private firestoreService: FirestoreService) {}

  ngOnInit(): void {
    this.getDocuments();
  }

  // Create a document with user-input data
  createDocument(): void {
    const data = { nombre: this.nuevoNombre, edad: this.nuevaEdad, fechaNacimiento: this.nuevaFechaNacimiento  };
    this.firestoreService.createDocument('todos', data).then(() => {
      console.log('Document created');
      this.nuevoNombre = '';
      this.nuevaEdad = '';
      this.nuevaFechaNacimiento = '';

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

  // Update a document
  // updateDocument(id: string): void {
  //   const data = { name: 'Updated Document', value: 'Updated value' };
  //   this.firestoreService.updateDocument('your-collection', id, data).then(() => {
  //     console.log('Document updated');
  //     this.getDocuments();
  //   });
  // }


    // Delete a document
    deleteDocument(id: string): void {
      this.firestoreService.deleteDocument('todos', id).then(() => {
        console.log('Document deleted');
        this.getDocuments();
      });
    }
}