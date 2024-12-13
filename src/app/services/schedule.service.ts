// src/app/services/schedule.service.ts
import { Injectable } from '@angular/core';
import { AwsS3Service } from './aws-s3.service';
import { Observable, from, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { Hora } from '../models/hora.model';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  private key = 'horas.json';

  constructor(private awsS3Service: AwsS3Service) {}

  getHours(): Observable<Hora[]> {
    return from(this.awsS3Service.getJsonFile(this.key)).pipe(
      map((data: any) => data as Hora[]),
      catchError(() => of([]))
    );
  }

  addHour(hora: Hora): Observable<void> {
    return from(this.awsS3Service.fileExists(this.key)).pipe(
      switchMap((exists: boolean) => {
        if (exists) {
          return from(this.awsS3Service.getJsonFile(this.key)).pipe(
            switchMap((existingHoras: Hora[]) => {
              existingHoras.push(hora);
              return from(this.awsS3Service.uploadJsonFile(this.key, existingHoras));
            })
          );
        } else {
          const horas: Hora[] = [hora];
          return from(this.awsS3Service.uploadJsonFile(this.key, horas));
        }
      }),
      catchError(() => of())
    );
  }

  deleteHour(hora: Hora): Observable<void> {
    return from(this.awsS3Service.fileExists(this.key)).pipe(
      switchMap((exists: boolean) => {
        if (!exists) {
          return of();
        }
        return from(this.awsS3Service.getJsonFile(this.key)).pipe(
          switchMap((existingHoras: Hora[]) => {
            const updatedHoras = existingHoras.filter(
              (h: Hora) =>
                !(h.date === hora.date && h.time === hora.time && h.doctor === hora.doctor)
            );
            return from(this.awsS3Service.uploadJsonFile(this.key, updatedHoras));
          })
        );
      }),
      catchError(() => of())
    );
  }

  updateHour(id: string, updatedHora: Hora): Observable<void> {
    return from(this.awsS3Service.fileExists(this.key)).pipe(
      switchMap((exists: boolean) => {
        if (!exists) {
          return of();
        }
        return from(this.awsS3Service.getJsonFile(this.key)).pipe(
          switchMap((existingHoras: Hora[]) => {
            const index = existingHoras.findIndex(
              (h: Hora) => h.date === updatedHora.date && h.time === updatedHora.time && h.doctor === updatedHora.doctor
            );
            if (index !== -1) {
              existingHoras[index] = updatedHora;
              return from(this.awsS3Service.uploadJsonFile(this.key, existingHoras));
            }
            return of();
          })
        );
      }),
      catchError(() => of())
    );
  }
}
