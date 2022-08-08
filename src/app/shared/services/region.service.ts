import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {  Region } from '../model/region';
import {Docs} from '../model/docs';

@Injectable({
  providedIn: 'root'
})
export class RegionService {

  url = environment.apiMongo;
  constructor(private http: HttpClient) { }

  getRegions() {
      return this.http.get<Docs<Region>>(this.url+'/regions');
  }
}
