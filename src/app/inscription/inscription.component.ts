import {Component, OnInit} from '@angular/core';
import { FormGroup} from '@angular/forms';
import {Vaccin} from '../shared/model/vaccin';
import {VaccinCentre} from '../shared/model/vaccinCentre';
import { RequeteService } from '../service/requete.service';
import { AuthService } from '../service/auth.service';
import { UtileService } from '../service/utile.service';
import axios from 'axios';

export function ComparePassword(
  controlName: string,
  matchingControlName: string
) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors.mustMatch) {
      return;
    }

    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({mustMatch: true});
    } else {
      matchingControl.setErrors(null);
    }
  };
}

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.scss'],
})
export class InscriptionComponent implements OnInit {

  form: FormGroup;
  vaccins: Vaccin[];
  vaccinCentre: VaccinCentre[];
  //stepper
  stepper:number = 1;
  //liste vaccin
  dataListVaccinView :any = {data : [],page : 0, libeller : '', colone : '',totalpage : 0, };
  dataSearchListVaccinView: any = {libeller : '', colone : '',etat : false};
  listeVaccin:any[]=[];
  vaccinPage:number[]=[];
  vaxPage:number = 0;
  
  //data vaccin
  dataVaccinInscriptionPatient:any =null;
  // vaccinodrome
  dataListVaccinCentreView:any = {data : [],page : 0, libeller : '', colone : '',totalpage : 0, };
  dataSearchListVaccinCentreView:any = {libeller : '', colone : '',etat : false};
  listeVaccinodrome:any[]=[];
  vaccinodromePage:number[]=[];
  vaxDroPage:number = 0;
  dataAvertissementMaladie:string= "";
  //data vaccinodrome
  dataVaccinodromeInscriptionPatient:any = null;
  //data inscription
  nomP:string="";naissanceP:string="";sexeP:string="0";emailP:string="";telephoneP:string="";mdpP:string="";confirmerP:string="";
  imageProfileP:any=null;

  constructor(private requeteService:RequeteService,private authService:AuthService,private utileService: UtileService) {
  }

  ngOnInit() {
    this.getDataVaccinView(0);
  }
  createTableauNumberSelect(start, end) {
    const data = [];
    for (let i = start; i < end; i++) {
        data.push({ value: i, label: i });
    }
    return data;
  }
  //data vaccinview to display list
  getVerificationDataPageVaccinView(page){
    let data = this.dataListVaccinView.data;let size =  data.length;
    if(size > 0){
        for (let i = 0; i < size; i++) {
            if(data.page === page){
                this.dataListVaccinView = {data : this.dataListVaccinView.data,page : page, libeller : this.dataListVaccinView.libeller, colone : this.dataListVaccinView.colone};
                return true;
            }
        }
        return false;
    }
    return false;
  }
  getDataVaccinView(page){
      if(!this.getVerificationDataPageVaccinView(page)){
          let dataSearchListVaccinView = this.dataSearchListVaccinView;
          let url = "vaccin/";let libeller =  dataSearchListVaccinView.libeller;
          if(dataSearchListVaccinView.etat && this.utileService.verifString(libeller)){url=url+"vaccinviewsearch/10/"+page+"/"+libeller;}else{url=url+"vaccinview/10/"+page;}
          this.requeteService.getRequeteGet(url).subscribe((response:any)=>{
            if(response!==null && response!==undefined){
              let dataListVaccinView = this.dataListVaccinView;let tmp= dataListVaccinView.data;let size = tmp.length;let test = false;
              for(let i = 0; i < size; i++){ if(tmp[i].page === page){test= true; break; } }
              if(!test){ tmp.push({docs : response.docs,page : response.page}); }
              this.dataListVaccinView = {data : tmp,page : response.page, libeller : dataListVaccinView.libeller, colone : dataListVaccinView.colone,totalpage : response.totalPages};
              this.listeVaccin = this.getDataVaccinViewInState(this.dataListVaccinView);
              this.vaccinPage = this.createTableauNumberSelect(0,response.totalPages);
              console.log('data vaccin : ',this.listeVaccin)
            }else{
              alert("Le serveur est hors-service");
            }
          },(errorResponse)=>{
            alert("Erreur d'information.")
          });
      }
  }
  getDataVaccinViewInState(dataListVaccinView){
      let data = dataListVaccinView.data;let page = dataListVaccinView.page;let size = data.length;
      if(size > 0){
          for (let i = 0; i < size; i++) {
              if(data[i].page === page){
                  return data[i].docs;
              }
          }
          return [];
      }
      return [];
  }
  paginationListeVaccin(){
    this.getDataVaccinView(this.vaxPage)
  }
  changeVaccinSearch(valeur){
    this.dataSearchListVaccinView = {libeller : valeur, colone : '',etat : true};
  }
  onSearchLibelleInVaccin(){
    this.dataListVaccinView = {data : [],page : 0, libeller : '', colone : '',totalpage : 0};
    this.getDataVaccinView(0);
  }
  onActualiserSearchLibelleInVaccin(){
    this.dataListVaccinView = {data : [],page : 0, libeller : '', colone : '',totalpage : 0, };
    this.dataSearchListVaccinView = {libeller : '', colone : '',etat : false};
    this.listeVaccin=[];
    this.getDataVaccinView(0);
  }
  selectVaccin(item){
    this.dataVaccinInscriptionPatient= item;
    this.getDataVaccinCentreView(0);
    this.getAvertissementMaladie(this.dataVaccinInscriptionPatient.idVaccin);
    this.stepper=2;
  }
  setStepper(valeur:number){
    if(valeur>1){
      this.stepper=valeur;
    }else{
      this.stepper=1;
    }
  }
  //data vaccincentreview to display list
  getVerificationDataPageVaccinCentreView(page){
      let data = this.dataListVaccinCentreView.data;let size =  data.length;
      if(size > 0){
          for (let i = 0; i < size; i++) {
              if(data.page === page){
                  this.dataListVaccinCentreView = {data : this.dataListVaccinCentreView.data,page : page, libeller : this.dataListVaccinCentreView.libeller, colone : this.dataListVaccinCentreView.colone};
                  return true;
              }
          }
          return false;
      }
      return false;
  }
  getDataVaccinCentreView(page){
      let idvaccin = this.dataVaccinInscriptionPatient.idVaccin;
      if(idvaccin!==undefined && idvaccin!==null && idvaccin>0){
        if(!this.getVerificationDataPageVaccinCentreView(page)){
          let dataSearchListVaccinCentreView = this.dataSearchListVaccinCentreView;
          let url = "vaccincentre/";let libeller =  dataSearchListVaccinCentreView.libeller;
          if(dataSearchListVaccinCentreView.etat && this.utileService.verifString(libeller)){url=url+"searchbyidvaccin/"+idvaccin+"/10/"+page+"/"+libeller;}else{url=url+"listbyidvaccin/"+idvaccin+"/10/"+page;}
          this.requeteService.getRequeteGet(url).subscribe((response:any)=>{
            if(response!==null && response!==undefined){
              let dataListVaccinCentreView = this.dataListVaccinCentreView;let tmp= dataListVaccinCentreView.data;let size = tmp.length;let test = false;
              for(let i = 0; i < size; i++){ if(tmp[i].page === page){test= true; break; } }
              if(!test){ tmp.push({docs : response.docs,page : response.page}); }
              this.dataListVaccinCentreView = {data : tmp,page : response.page, libeller : dataListVaccinCentreView.libeller, colone : dataListVaccinCentreView.colone,totalpage : response.totalPages};
              console.log('vaccinodrome : ',this.dataListVaccinCentreView)
              this.listeVaccinodrome = this.getDataVaccinCentreViewInState(this.dataListVaccinCentreView);
              this.vaccinodromePage = this.createTableauNumberSelect(0,response.totalPages);
              console.log('vaccinodrome : ',this.listeVaccinodrome)
            }else{
              alert("Le serveur est hors-service");
            }
          },(errorResponse)=>{
            alert("Erreur d'information.")
          });
        }
      }
  }
  getDataVaccinCentreViewInState(dataListVaccinCentreView){
      let data = dataListVaccinCentreView.data;let page = dataListVaccinCentreView.page;let size = data.length;
      if(size > 0){
          for (let i = 0; i < size; i++) {
              if(data[i].page === page){
                console.log('mmm : ',data[i].docs);
                  return data[i].docs;
              }
          }
          return [];
      }
      return [];
  }
  //get data avertissement maladie
  getAvertissementMaladie(idvaccin){
    if(this.utileService.verifString(''+idvaccin)){
      this.requeteService.getRequeteGet('maladie/avertissement-maladie/'+idvaccin).subscribe((response:any)=>{
        if(response!==null && response!==undefined){
          this.dataAvertissementMaladie = response;
          console.log('vaccinodrome : ',this.dataAvertissementMaladie)
        }else{
          alert("Le serveur est hors-service");
        }
      },(errorResponse)=>{
        alert("Erreur d'information.")
      });
    }
  }
  getLocalisationVaccinodrome(valeur:string){
    let data = valeur.split('///');
    return data;
  }
  paginationListeVaccinodrome(){
    this.getDataVaccinCentreView(this.vaxDroPage)
  }
  selectionnerVaccinodrome(item){
    this.dataVaccinodromeInscriptionPatient = item;
    this.stepper = 3;
  }
  // change image patient
  getVerifiExtensionImage(filename){
    let namesplit = filename.split('.');let size = namesplit.length;
    if(size>0){
        let ext = namesplit[size-1];
        if(ext==='png' || ext==='jpg' || ext==='jpeg'){
            return true;
        }
    }
    return false;
  }
  changeImageToBase64($event){
    let files = $event.target.files;
    if(files.length >0){
        let size = files[0].size/1024;
        if(size<=1000){
            if(this.getVerifiExtensionImage(files[0].name)){
              this.imageProfileP= files[0];
            }else{
              alert("L'image doit être au format JPG,JPEG ou PNG.");
            }
        }else{
          alert("L'image doit être inférieur à 1000ko ( Votre image est de "+size+"ko )");
        }
    }else{
      alert("L'image contient des informations erronées.");
    }   
  }
  enregistrePatient(){
     //this.nomP:string="";naissanceP:string="";sexeP:string="";emailP:string="";telephoneP:string="";mdpP:string="";confirmerP:string="";
      //imageProfileP:any=null;
      let sexe = this.utileService.parseStringToInt(this.sexeP);let vaccin = this.dataVaccinInscriptionPatient;
      let vaccinodrome = this.dataVaccinodromeInscriptionPatient;
      if(this.utileService.verifString(this.nomP) && this.utileService.verifString(this.naissanceP) && sexe>=1 && sexe<=2 && this.utileService.verifString(this.emailP) 
        && this.utileService.verifString(this.telephoneP) && this.utileService.verifString(this.mdpP) && this.utileService.verifString(this.confirmerP) 
        && this.imageProfileP!==undefined && this.imageProfileP!==null && vaccin!==undefined && vaccin!==null && vaccinodrome!==null && vaccinodrome!==undefined){
            let dateNaissance = new Date(""+this.naissanceP); let age = (new Date()).getFullYear() - dateNaissance.getFullYear();
            if(this.mdpP === this.confirmerP && age > 0){
                let ageMini = vaccinodrome.ageMinimum;
                if(age>=ageMini){
                    const dataPhoto = new FormData() 
                    dataPhoto.append('photo', this.imageProfileP)
                    axios.post(this.requeteService.getUrlNodeJs()+"photo", dataPhoto).then(res => { 
                        if(res.data!==null && res.data!==undefined){
                            let imageUrl = res.data.image;
                            if(imageUrl!==null && imageUrl!==undefined && imageUrl!==''){
                                let dataPatient = {
                                    utilisateur : {
                                        idutilisateur : 0,
                                        idtypeutilisateur : 100,
                                        nom : this.nomP,
                                        sexe : sexe,
                                        naissance : this.naissanceP,
                                        email : this.emailP,
                                        telephone : this.telephoneP,
                                        mot_de_passe : this.mdpP,
                                        urlPhoto : imageUrl,
                                        date_ajout : this.naissanceP,
                                        status : 1
                                    },
                                    infoVaccinUser : {
                                        idInfoVaccinUser : 0,
                                        idUtilisateur : 0,
                                        idVaccinCentre : vaccinodrome.idVaccinCentre,
                                        idVaccinodrome : vaccinodrome.idVaccinodrome,
                                        idVaccin : vaccinodrome.idVaccin,
                                        status : 1
                                    }
                                }
                                this.requeteService.getRequetePost('utilisateur/inscription-patient',dataPatient).subscribe((response:any)=>{
                                  if(response!==null && response!==undefined){
                                    alert(""+response.message);
                                  }else{
                                    alert("Le serveur est hors-service");
                                  }
                                },(errorResponse)=>{
                                  alert("Erreur d'information.")
                                });
                            }
                        }else{
                          alert("L'insertion de l'image a echoué");
                        }
                    })
                }else{
                  alert("L'age minimum pour ce vaccin est de "+age+" ans.");
                }
            }else{
              alert("Il y a une information incorrecte ou votre mot de passe n'est pas valide.");
            }
        }else{
          alert("Les informations sont incomplètes, merci de compléter tous les champs.");
        }
  }
}
