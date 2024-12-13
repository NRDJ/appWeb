import { Component, OnInit } from '@angular/core';
import {JsonService} from '../../services/json.service';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';

@Component({
  selector: 'app-lista-personas',
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  templateUrl: './lista-personas.component.html',
  styleUrls: ['./lista-personas.component.css'],
  providers: [JsonService]
})
export class ListaPersonasComponent implements OnInit {

  horas: any;

  constructor(private jsonService: JsonService) { }

  ngOnInit() {
    this.jsonService.getJsonData().subscribe(data => {
      this.horas = data;
    });
  }

  eliminar(hora: any) {
    const index = this.horas.findIndex((elemento:any) => elemento.id === hora.id);

    if(index !== -1) {
      this.horas.splice(index, 1);
      this.jsonService.MetodoHora(this.horas);
    } else {
      console.log("No se encontró el elemento");
      window.alert("No se encontró el elemento");
    }
  }

  modificar(hora: any) {
    const index = this.horas.findIndex((elemento:any) => elemento.id === hora.id);

    if(index !== -1) {
      const nueva : any = {
        id: hora.id,
        date: hora.date,
        time: hora.time,
        doctor: hora.doctor
      };
      this.horas[index] = { ...this.horas[index], ...nueva };
      this.jsonService.MetodoHora(this.horas);
      
    } else {
      console.log("No se encontró el elemento");
      window.alert("No se encontró el elemento");
    }
  }
}
