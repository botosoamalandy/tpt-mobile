import { Injectable } from '@angular/core';
import jwt_decode from "jwt-decode";
import {UtileService} from './utile.service';

export interface UtilisateurToken {
  iss: number;
  codeutilisateur: number;
  nom: string;
  email: string;
  expiration: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private utileService:UtileService) { }

  getVerifString(valeur){
    if(valeur !== null && valeur !== undefined){
        return true;
    }
    return false;
  }
  getVerifToken(token) {
    if(token !== null && token !== undefined && token !== "null" && token !== ""){
        let utilisateur:UtilisateurToken = jwt_decode(token);
        if(this.getVerifString(utilisateur.iss) && this.getVerifString(utilisateur.codeutilisateur) && this.getVerifString(utilisateur.nom) && this.getVerifString(utilisateur.email) 
            && this.getVerifString(utilisateur.expiration)){
            return true;
        }
    }
    return false;
  }
  getDataUtilisateurByToken(token) {
    if(token !== null && token !== undefined && token !== "null"){
        try {
            let utilisateur:UtilisateurToken = jwt_decode(token);
            let verifiToken = this.getVerifToken(token)
            if(verifiToken){
                return {
                    id: utilisateur.iss,
                    codeutilisateur: utilisateur.codeutilisateur,
                    nom: utilisateur.nom,
                    email: utilisateur.email,
                    expiration: utilisateur.expiration,
                };
            }
        } catch (error) {
            return null;
        }
    }
    return null;
  }
  
  getDataUtilisateurToken() {
    let token  = this.getToken();
    return this.getDataUtilisateurByToken(token);
  }
  authentificationUtilisateur(token) {
    localStorage.clear();
    localStorage.setItem('token',token);
  }
  deconnection() {
    localStorage.clear();
  }
  getToken() {
    let token = localStorage.getItem('token');
    if (token !== null && token !== undefined && token !== '') { return token; }
    else{ this.deconnection(); return null; }
  }
  getAuthentication() {
      let token = this.getToken();
      if(token !== null && token !== undefined){
          let utilisateur = this.getDataUtilisateurByToken(token);
          if(utilisateur!==null && utilisateur !== undefined){
              let exp = this.utileService.parseStringToInt(utilisateur.expiration);let now = (new Date()).getTime();
              if(exp>now){
                  return { utilisateur : utilisateur,etat : true }
              }else{
                  this.deconnection();
              }
          }
      }
      return { utilisateur : null,etat : false }
  }
}
