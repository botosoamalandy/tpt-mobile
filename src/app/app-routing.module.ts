import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { InscriptionComponent } from './inscription/inscription.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './shared/services/auth.guard';
import { SplashComponent } from './splash/splash.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserRdvComponent } from './user-rdv/user-rdv.component';
import { AuthconnexionGuard } from './service/authconnexion.guard';
import { MafamilleComponent } from './mafamille/mafamille.component';
import { FamilleComponent } from './famille/famille.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent , canActivate: [AuthconnexionGuard]},
  { path: 'login',component: LoginComponent, canActivate: [AuthconnexionGuard] },
  { path: 'inscription', component: InscriptionComponent , canActivate: [AuthconnexionGuard]},
  { path: 'splash', component: SplashComponent },
  { path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuard], },
  { path: 'user-ma-famille', component: FamilleComponent, canActivate: [AuthGuard] },
  { path: 'user-rdv', component: UserRdvComponent, canActivate: [AuthGuard], }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
