import {HttpClient} from '@angular/common/http';
import {Injectable, OnInit} from '@angular/core';
import {environment} from 'src/environments/environment';
import {Login} from '../model/login';
import {tap} from 'rxjs/operators';
import {Response} from '../model/response';
import {Auth} from '../model/user';
import {JwtDecodeService} from '../utils/jwt-decode.service';
import {UserService} from './user.service';
import {Utilisateur} from '../model/utilisateur';
import {BehaviorSubject, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService implements OnInit{

  urlBack = environment.apiJava;
  urlLogin = this.urlBack + '/utilisateur/login-utilisateur';
  private userConnected: Utilisateur;
  private userSubject = new BehaviorSubject<Utilisateur>(null);

  constructor(private http: HttpClient, private jwtDecode: JwtDecodeService, private userService: UserService) {
  }

  ngOnInit(): void {
  }

  login(login: Login) {
    return this.http.post<Response>(this.urlLogin, login).pipe(tap(res => {
      if( res.status === 200) {
        this.setSession(res);
      }
    }));
  }

  private setSession(response: Response) {
    const decode = this.jwtDecode.getDecodedAccessToken(response.token);
    localStorage.setItem('token', response.token);
    localStorage.setItem('auth', JSON.stringify(decode));
    this.userService.getUser(decode?.iss).subscribe(user => {
      this.userConnected = new Utilisateur(user);
      localStorage.setItem('user',JSON.stringify(this.userConnected));
    });
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("auth");
    localStorage.removeItem("user");
  }

  getToken() {
    return localStorage.getItem("token");
  }

  isAuth() {
    const auth = localStorage.getItem("auth");
    const info = new Auth(JSON.parse(auth));
    const now = new Date();
    return now.getTime() < (new Date(info.expiration)).getTime();
  }

  getUserConnected() {
    const user = new Utilisateur(JSON.parse(localStorage.getItem("user")));
    if(user?.idtypeutilisateur != null) {
      this.userSubject.next(user);
    }else {
      const decode = this.jwtDecode.getDecodedAccessToken(localStorage.getItem("token"));
      this.userService.getUser(decode?.iss).subscribe(u => {
        const utilisateur = new Utilisateur(u);
        this.userSubject.next(utilisateur);
        localStorage.setItem('user',JSON.stringify(utilisateur));
      });
    }
    return this.userSubject;
  }


}
