import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';
import { ServiciosComponent } from './components/servicios/servicios.component';
import { UbicacionComponent } from './components/ubicacion/ubicacion.component';
import { FooterComponent } from './components/footer/footer.component';
import { RegistroComponent } from './components/registro/registro.component';
import { AgendarHoraComponent } from './components/agendar-hora/agendar-hora.component';
import { FormsModule } from '@angular/forms';
import { PasswordStrengthDirective } from './validators/password-strength.directive'
import { EmailValidatorDirective } from './validators/email-validator.directive';
import { AgeValidatorDirective } from './validators/age-validator.directive';
import { ProfileComponent } from './components/profile/profile.component';
import { PasswordRecoveryComponent } from './components/password-recovery/password-recovery.component';
import { HttpClientModule } from '@angular/common/http'; 
import { AuthService } from './services/auth.service';
import { ScheduleService } from './services/schedule.service';
import { ConocenosComponent } from './components/conocenos/conocenos.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    NavbarComponent,
    HeroSectionComponent,
    ServiciosComponent,
    UbicacionComponent,
    FooterComponent,
    RegistroComponent,
    AgendarHoraComponent,
    PasswordStrengthDirective,
    EmailValidatorDirective,
    AgeValidatorDirective,
    ProfileComponent,
    PasswordRecoveryComponent,
    ConocenosComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [AuthService, ScheduleService],
  bootstrap: [AppComponent]
})
export class AppModule { }
