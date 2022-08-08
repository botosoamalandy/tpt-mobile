import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RequeteService {

  // urlRequette:string='http://localhost:8087/rdvvaksiny/';
  // urlNodejs:string = "https://serveur-nodejs-tpt.herokuapp.com/rdvvaksiny/";

  urlRequette:string="https://tpt-serveur.herokuapp.com/rdvvaksiny/";
  urlNodejs:string = "https://serveur-nodejs-tpt.herokuapp.com/rdvvaksiny/";


  constructor(private httpClient:HttpClient) { }
  getUrlNodeJs(){
    return this.urlNodejs;
  }
  setUrl(newUrl:string){
    this.urlRequette=newUrl;
  }
  getUrlRequette():string{
    return this.urlRequette;
  }
  getUrlRequetteWithParameter(parameter:string):string{
    return this.urlRequette+''+parameter;
  }
  getRequetePost(parametreUrl:string,data){
    return this.httpClient.post(this.urlRequette+''+parametreUrl,data,{
      headers: new HttpHeaders(
        {
          'Content-Type':'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': this.urlRequette+''+parametreUrl
        }
      )
    });
  }
  getRequeteGet(parametreUrl:string){
    console.log("url : ",this.urlRequette+''+parametreUrl);
    return this.httpClient.get(this.urlRequette+''+parametreUrl,{
      headers: new HttpHeaders(
        {
          'Content-Type':'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': this.urlRequette+''+parametreUrl
        }
      )
    });
  }


}
