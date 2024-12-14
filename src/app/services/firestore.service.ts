import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  constructor(private firestore: AngularFirestore) {}

  // Create a new document
  createDocument(collection: string, data: any): Promise<void> {
    const id = this.firestore.createId();
    return this.firestore.collection(collection).doc(id).set(data);
  }

  // Read documents from a collection
  getDocuments(collection: string): Observable<any[]> {
    return this.firestore.collection(collection).snapshotChanges().pipe(
      map((actions: any[]) => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  // Update a document
  updateDocument(collection: string, id: string, data: any): Promise<void> {
    return this.firestore.collection(collection).doc(id).update(data);
  }

  // Delete a document
  deleteDocument(collection: string, id: string): Promise<void> {
    return this.firestore.collection(collection).doc(id).delete();
  }
}