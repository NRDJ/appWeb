// src/app/components/s3-manager/s3-manager.component.ts
import { Component, OnInit } from '@angular/core';
import { AwsS3Service } from '../../services/aws-s3.service';

interface Hora {
  date: string;
  time: string;
  doctor: string;
}

@Component({
  selector: 'app-s3-manager',
  templateUrl: './s3-manager.component.html',
  styleUrls: ['./s3-manager.component.css'],
})
export class S3ManagerComponent implements OnInit {
  selectedFile: File | null = null;
  uploadStatus: string = '';
  fileUrl: string = '';
  deleteStatus: string = '';
  s3Key: string = '';
  horas: Hora[] = [];
  newHora: Hora = { date: '', time: '', doctor: '' };
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private awsS3Service: AwsS3Service) {}

  ngOnInit(): void {
    this.loadHoras();
  }

  async scheduleHour(): Promise<void> {
    if (!this.newHora.date || !this.newHora.time || !this.newHora.doctor) {
      this.errorMessage = 'Por favor, completa todos los campos.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    const key = 'horas.json';

    try {
      const exists = await this.awsS3Service.fileExists(key);

      if (exists) {
        const existingHoras = await this.awsS3Service.getJsonFile(key);
        existingHoras.push(this.newHora);
        await this.awsS3Service.uploadJsonFile(key, existingHoras);
      } else {
        const horas: Hora[] = [this.newHora];
        await this.awsS3Service.uploadJsonFile(key, horas);
      }

      this.uploadStatus = 'Hora agendada con éxito.';
      this.newHora = { date: '', time: '', doctor: '' };
      this.loadHoras();
    } catch (error) {
      console.error('Error al agendar hora:', error);
      this.uploadStatus = 'Error al agendar la hora. Inténtalo de nuevo.';
    } finally {
      this.isLoading = false;
    }
  }

  async loadHoras(): Promise<void> {
    const key = 'horas.json';
    try {
      const exists = await this.awsS3Service.fileExists(key);
      if (exists) {
        this.horas = await this.awsS3Service.getJsonFile(key);
      } else {
        this.horas = [];
      }
    } catch (error) {
      console.error('Error al cargar horas:', error);
      this.horas = [];
    }
  }

  async deleteHour(hora: Hora): Promise<void> {
    const key = 'horas.json';
    try {
      const exists = await this.awsS3Service.fileExists(key);
      if (!exists) {
        alert('No existen horas agendadas.');
        return;
      }

      const existingHoras = await this.awsS3Service.getJsonFile(key);
      const updatedHoras = existingHoras.filter(
        (h: Hora) =>
          !(h.date === hora.date && h.time === hora.time && h.doctor === hora.doctor)
      );

      await this.awsS3Service.uploadJsonFile(key, updatedHoras);
      alert('Hora cancelada exitosamente.');
      this.loadHoras();
    } catch (error) {
      console.error('Error al cancelar hora:', error);
      alert('Error al cancelar la hora. Inténtalo de nuevo.');
    }
  }

  editHour(id: number, hora: Hora): void {
    alert('Funcionalidad de edición no implementada.');
  }
}
