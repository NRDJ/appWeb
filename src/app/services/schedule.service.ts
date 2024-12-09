import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
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

  // GET: Retrieve all hours
  getHours(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // PUT: Update an existing hour
  updateHour(id: string, hour: any): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<any>(url, hour, this.httpOptions);
  }

  // DELETE: Delete an hour
  deleteHour(id: string): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<any>(url, this.httpOptions);
  }
}