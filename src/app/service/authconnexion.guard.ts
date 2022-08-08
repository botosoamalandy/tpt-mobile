import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthconnexionGuard implements CanActivate {

  constructor(private authService: AuthService , private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let authPatient = this.authService.getAuthentication();
    if(authPatient.etat && authPatient.utilisateur.codeutilisateur===100){
      this.router.navigate(["/user-profile"]);
      return false;
    }else {
      return true;
    }
  }
  
}
