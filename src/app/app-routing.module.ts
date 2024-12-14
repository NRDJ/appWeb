import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { RegistroComponent } from './components/registro/registro.component';
import { AgendarHoraComponent } from './components/agendar-hora/agendar-hora.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PasswordRecoveryComponent } from './components/password-recovery/password-recovery.component';
import { ListaPersonasComponent } from './components/lista-personas/lista-personas.component';
import { authGuard } from './guards/auth.guard';
import { ExampleComponent } from './components/example/example.component';

const routes: Routes = [
  { 
    path: 'home', 
    component: HomeComponent,
    canActivate: [authGuard] // Protect the Home route
  },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'agendar-hora', component: AgendarHoraComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'password-recovery', component: PasswordRecoveryComponent },
  { path: 'lista-personas', component: ListaPersonasComponent },
  { path: 'example', component: ExampleComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}