import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {InfoVaccinUser, Utilisateur} from '../model/utilisateur';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url = environment.apiJava;
  constructor(private http: HttpClient) { }

  getUser(id: string) {
    return this.http.get<Utilisateur>(this.url+'/utilisateur/byid/'+id);
  }

  inscriptionPatient(user: Utilisateur, infoVaccin: InfoVaccinUser) {
    const data = {utilisateur: user, infoVaccinUser: infoVaccin};
    return this.http.post(this.url+ '/inscription-patient', data);
  }
}
