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

  personas: any;

  constructor(private jsonService: JsonService) { }

  ngOnInit() {
    this.jsonService.getJsonData().subscribe(data => {
      this.personas = data;
    });
  }

}
