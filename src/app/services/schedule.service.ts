import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private presignedUrlApi = 'http://localhost:4200/'; // Replace with your server URL
  private apiUrl = 'https://horas.s3.us-east-1.amazonaws.com/horas.json'; // Replace with your actual S3 bucket URL
  
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  // POST: Add a new hour
  addHour(hour: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, hour, this.httpOptions);
  }

  getHours(): Observable<any[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(data => {
        // Ensure the data is an array
        return Array.isArray(data) ? data : [];
      })
    );
  }

  // PUT: Update an existing hour
  updateHour(id: string, hour: any): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<any>(url, hour, this.httpOptions);
  }

  // DELETE: Delete an hour
  // deleteHour(id: string): Observable<any> {
  //   const url = `${this.apiUrl}/${id}`;
  //   return this.http.delete<any>(url, this.httpOptions);
  // }

    // DELETE: Delete an hour
    deleteHour(hourToDelete: any): Observable<any> {
      return this.getHours().pipe(
        switchMap(existingHours => {
          const updatedHours = existingHours.filter(hour => hour !== hourToDelete);
          return this.http.get<{ url: string }>(this.presignedUrlApi).pipe(
            switchMap(response => {
              const url = response.url;
              return this.http.put(url, JSON.stringify(updatedHours), {
                headers: new HttpHeaders({ 'Content-Type': 'application/json' })
              });
            })
          );
        })
      );
    }
}