import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtileService {

  constructor() { }

  getVerifiExtensionImage(filename) {
    let namesplit = filename.split('.');let size = namesplit.length;
    if(size>0){
        let ext = namesplit[size-1];
        console.log('extension : ',ext);
        if(ext==='png' || ext==='jpg' || ext==='jpeg'){
            return true;
        }
    }
    return false;
  }
  verifString(valeur:string){
    if(valeur!==null && valeur!==undefined && valeur!==""){
      return true;
    }
    return false;
  }
  parseStringToInt(valeur) {
    try {
        if ('' + valeur !== '') {
            return parseInt('' + valeur);
        }
        return 0;
    } catch (error) {
        return 0;
    }
  }
  getAllMois() {
    return ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
  }
  getNamesMois(indice) {
    const data = this.getAllMois();
    return data[indice];
  }
  getAllSemaine() {
    const semaine = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
    return semaine;
  }
  getNamesSemaine(indice) {
    const data = this.getAllSemaine();
    return data[indice];
  }
  getDateComplet(dateString) {
    if (dateString === null || dateString === undefined || dateString === "null") { return ""; }
    const dates = new Date(dateString);
    return "" +this.getNamesSemaine(dates.getDay()) + ", " + dates.getDate() + " " + this.getNamesMois(dates.getMonth()) + " " + dates.getFullYear();
  }
  getDateFormatNormal(dateString) {
    if (dateString === null || dateString === undefined || dateString === "null") { return ""; }
    const dates = new Date(dateString);
    return "" +dates.getFullYear() + "-" +this.completChiffre(dates.getMonth()+1)+ "-"+ this.completChiffre(dates.getDate());
  }
  getDateFormatNormalByTypeDate(dateTime:number) {
    if (dateTime === null || dateTime === undefined || dateTime >0 ) { return ""; }
    const dates = new Date(dateTime);
    return "" +dates.getFullYear() + "-" +this.completChiffre(dates.getMonth()+1)+ "-"+ this.completChiffre(dates.getDate());
  }
  completChiffre(chiffre) {
      let tmp = this.parseStringToInt('' + chiffre);
      if (tmp < 10) {
          return '0' + tmp;
      }
      return '' + tmp;
  }
  getDateCompletAuJourdui() {
    const dates = new Date();
    return "" +this.getNamesSemaine(dates.getDay()) + ", " + dates.getDate() + " " + this.getNamesMois(dates.getMonth()) + " " + dates.getFullYear();
  }
}
