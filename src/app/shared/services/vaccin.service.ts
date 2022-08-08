import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Vaccin} from '../model/vaccin';
import {Docs} from '../model/docs';

@Injectable({
  providedIn: 'root'
})
export class VaccinService {
  urlVaccin = environment.apiJava + '/vaccin';

  constructor(private http: HttpClient) {
  }

  getAll() {
    return this.http.get<Docs<Vaccin>>(this.urlVaccin + '/list/10/0');
  }
}
