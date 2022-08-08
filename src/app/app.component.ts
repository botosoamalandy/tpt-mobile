import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {SplashService} from './shared/services/splash.service';
import {AuthService} from './service/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(public router: Router,private authService: AuthService, private splashService: SplashService) {
    this.initializeApp();
  }

  initializeApp() {
    this.router.navigateByUrl('splash');
  }

  get showSplash() {
    return this.splashService.showSplash;
  }

  getVeifIfUserisConnected() {
    let authPatient = this.authService.getAuthentication();
    if(authPatient!==null && authPatient!==undefined){
      if(authPatient.etat && authPatient.utilisateur.codeutilisateur===100){
        return true;
      }
    }
    return false;
  }

  logout() {
    this.authService.deconnection();
    this.router.navigate(['/login']);
  }
  
}
