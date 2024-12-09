import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class JsonService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'my-auth-token'
    })
  };

  private jsonURL = 'https://firebasestorage.googleapis.com/v0/b/angularapp-5a377.firebasestorage.app/o/personas.json?alt=media&token=43c1caef-7836-40cb-b31f-aeaa79e05ddc';

  constructor(private http: HttpClient) {}

  getJsonData(): Observable<any> {
    return this.http.get(this.jsonURL);
  }


}
