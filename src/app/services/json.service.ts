import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs';
import { error } from 'console';

@Injectable({
  providedIn: 'root'
})

export class JsonService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': '77133cab-ae05-4488-b0d3-31ca6d93bbfd'
    })
  };

  private jsonURL = 'https://firebasestorage.googleapis.com/v0/b/angularapp-5a377.firebasestorage.app/o/horas.json?alt=media&token=77133cab-ae05-4488-b0d3-31ca6d93bbfdn';

  constructor(private http: HttpClient) {}

  getJsonData(): Observable<any> {
    return this.http.get(this.jsonURL);
  }

  MetodoHora(listaHoras: any) {
    console.log(listaHoras);
    this.http.post(this.jsonURL,listaHoras,this.httpOptions).subscribe(
      response => {
        console.log("Archivo JSON sobrescrito con exito:", response);
      },
      error => {
        console.log("Error al sobrescribir archivo JSON:", error);
      }
    )
  }

}
