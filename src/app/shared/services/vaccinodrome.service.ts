import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Docs} from '../model/docs';
import {VaccinCentre} from '../model/vaccinCentre';

@Injectable({
  providedIn: 'root'
})
export class VaccinodromeService {
  urlVaccinodrome = environment.apiJava + '/vaccincentre';

  constructor(private http: HttpClient) { }

  getAllVaccinodrome(idVaccin: number,size: number, page: number) {
    return this.http.get<Docs<VaccinCentre>>(`${this.urlVaccinodrome}/listbyidvaccin/${idVaccin}/${size}/${page}`);
  }
}


