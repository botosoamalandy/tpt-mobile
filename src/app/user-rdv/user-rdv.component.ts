import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { RequeteService } from '../service/requete.service';
import { UtileService } from '../service/utile.service';
import { Famille } from '../shared/model/utilisateur';
import {NgxPaginationModule} from 'ngx-pagination';

@Component({
  selector: 'app-user-rdv',
  templateUrl: './user-rdv.component.html',
  styleUrls: ['./user-rdv.component.scss'],
})
export class UserRdvComponent implements OnInit {
  listFamille:any = {data : [],page : 0,totalpage : 0};
  listDataFamille:Famille[]=[];
  infoVaccinUser:any = null;
  vaccin:any = null;
  vaccinodrome:any = null;
  vaccinCentre:any = null;
  utilisateur:any = null;
  famille:any = null;
  horaireVaccinodrome:any[]=[];
  listDemandeRdv = {data : [],page : 0, libeller : '', colone : 'nomVaccinodrome',status : 1,totalpage : 0};
  listDemandeRdvSearch = { libeller : '', colone : 'nomVaccinodrome',ordre : false, status : 1, etat : false};
  listDataRdv = [];
  select:string = "nomVaccinodrome";
  nPage:number[]=[];
  sPage:number=0;
  infoDemandeRdv:any = null;
  stepper:number = 1;
  week:string[]=["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  // data add vaccinodrome
  familleAdd:string ="0";
  dateRdv:string="";
  doseRdv:string ="";
  description:string =""
  // data vaccinodrome
  dataListVaccinCentreView : any = {data : [],page : 0, libeller : '', colone : '',totalpage : 0, };
  dataSearchListVaccinCentreView : any = {libeller : '', colone : '',etat : false};
  dataVaccinInscriptionPatient = null;

  constructor(private requeteService:RequeteService,private authService:AuthService,private utileService: UtileService) { }

  ngOnInit() {
    this.getDataListDemandeRdv(0);
  }
  getDateNormal(date:string){
    this.utileService.getDateFormatNormal(date)
  }
  //get data information utilisateur
  getInfoUtilisateur(){
    let dataToken = this.authService.getDataUtilisateurToken();
    if(dataToken!==null && dataToken!==undefined){
        let idutilisateur = this.utileService.parseStringToInt(dataToken.id);
        if(idutilisateur!==undefined && idutilisateur!==null && idutilisateur>0){
          this.requeteService.getRequeteGet('utilisateur/info-vaccin-utilisateur/'+idutilisateur).subscribe((response:any)=>{
            if(response!==null && response!==undefined){
              if(response.status===200){
                this.infoVaccinUser = response.infoVaccinUser;this.vaccin = response.vaccin;this.vaccinodrome = response.vaccinodrome;this.vaccinCentre = response.vaccinCentre;
                this.utilisateur = response.utilisateur;this.famille = response.famille;
                console.log("info : ",response)
                this.getHoraireVaccinodromeByIdVaccinodrome(response.vaccinodrome.idVaccinodrome)
              }else{
                alert('Les informations sont incomplètes')
              }
            }else{
              alert("Le serveur est hors-service");
            }
          },(errorResponse)=>{
            alert("Erreur d'information.")
          });
        }
    }
  }
  //get data horaire vaccinodrome
  getHoraireVaccinodromeByIdVaccinodrome(idVaccinodrome){
    if(idVaccinodrome!==null && idVaccinodrome!==undefined && idVaccinodrome>0){
      this.requeteService.getRequeteGet('vaccinodrome/horaire-vaccinodrome/'+idVaccinodrome).subscribe((response:any)=>{
        if(response!==null && response!==undefined){
          this.horaireVaccinodrome=response;
          console.log("horaireVaccinodrome : ",this.horaireVaccinodrome)
        }else{
          alert("Le serveur est hors-service");
        }
      },(errorResponse)=>{
        alert("Erreur d'information.")
      });
    }
  }
  createTableauNumberSelect(start, end) {
    const data = [];
    for (let i = start; i < end; i++) {
        data.push({ value: i, label: i });
    }
    return data;
  }
  //data listDemandeRdv to display list
  getVerificationDataPageListDemandeRdv(page){
    let rdv = this.listDemandeRdv;let data = rdv.data;let size =  data.length;
    if(size > 0){
        for (let i = 0; i < size; i++) {
            if(data[i].page === page){
                this.listDemandeRdv = {data : rdv.data,page : data[i].page, libeller : rdv.libeller, colone : rdv.colone,status : rdv.status,totalpage : rdv.totalpage}
                return true;
            }
        }
        return false;
    }
    return false;
  }
  getDataListDemandeRdv(page){
      let dataToken = this.authService.getDataUtilisateurToken();
      if(dataToken!==null && dataToken!==undefined){
          let idutilisateur = this.utileService.parseStringToInt(dataToken.id);
          if(idutilisateur!==undefined && idutilisateur!==null && idutilisateur>0){
              let dataSearch = this.listDemandeRdvSearch;let listDemandeRdv = this.listDemandeRdv;let libeller:any = dataSearch.libeller;
              if(dataSearch.colone==="dateRdv"){
                  try {
                      let date = new Date(dataSearch.libeller);
                      libeller = date.getTime();
                  } catch (error) {
                      let date = new Date();
                      libeller = date.getTime();
                  }
              }
              if(dataSearch.etat){
                  let data = { 
                      limite  : 10,
                      page: page,
                      idUtilisateur : idutilisateur,
                      libeller : libeller,
                      colone : dataSearch.colone,
                      ordre : dataSearch.ordre,
                      status : dataSearch.status
                  };
                  let url = "demanderdv/searchlist-demande-rdv";
                  this.requeteService.getRequetePost(url,data).subscribe((response:any)=>{
                    if(response!==null && response!==undefined){
                      if(response !== undefined && response!==null){
                        let tmp= listDemandeRdv.data;let size = tmp.length;let test = false;
                        for(let i = 0; i < size; i++){ if(tmp[i].page === page){test= true; break; } }
                        if(!test){ tmp.push({docs : response.docs,page : response.page}); }
                        this.listDemandeRdv = {data : tmp,page : response.page, libeller : listDemandeRdv.libeller, colone : listDemandeRdv.colone,status : listDemandeRdv.status,totalpage : response.totalPages};
                        this.listDataRdv = this.getDataDemandeRdvInState(this.listDemandeRdv);
                        this.nPage = this.createTableauNumberSelect(0,response.totalPages);
                      }
                    }else{
                      alert("Le serveur est hors-service");
                    }
                  },(errorResponse)=>{
                    alert("Erreur d'information.")
                  });
              }else{
                  if(!this.getVerificationDataPageListDemandeRdv(page)){
                      let url = "demanderdv/list-demande-rdv/10/"+page+"/"+idutilisateur+"/"+dataSearch.status+"/"+dataSearch.ordre;
                      this.requeteService.getRequeteGet(url).subscribe((response:any)=>{
                        if(response!==null && response!==undefined){
                          let tmp= listDemandeRdv.data;let size = tmp.length;let test = false;
                          for(let i = 0; i < size; i++){ if(tmp[i].page === page){test= true; break; } }
                          if(!test){ tmp.push({docs : response.docs,page : response.page}); }
                          this.listDemandeRdv = {data : tmp,page : response.page, libeller : listDemandeRdv.libeller, colone : listDemandeRdv.colone,status : listDemandeRdv.status,totalpage : response.totalPages}
                          this.listDataRdv = this.getDataDemandeRdvInState(this.listDemandeRdv);
                          this.nPage = this.createTableauNumberSelect(0,response.totalPages);
                        }else{
                          alert("Le serveur est hors-service");
                        }
                      },(errorResponse)=>{
                        alert("Erreur d'information.")
                      });
                  }
              }
          }else{
            alert('Votre session est terminé.');
          }
      }else{
        alert('Votre session est terminé.');
      }
  }
  getDataDemandeRdvInState(listDemandeRdv){
      let data = listDemandeRdv.data;let page = listDemandeRdv.page;let size = data.length;
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
  onChangeSelectSearch(valeur){
    this.select = valeur;
    this.listDemandeRdvSearch.colone = valeur;
  }
  onChangeLibellerSearchSelect(valeur){
    this.listDemandeRdvSearch = { libeller : this.listDemandeRdvSearch.libeller, colone : this.listDemandeRdvSearch.colone,ordre : this.listDemandeRdvSearch.ordre, status : this.utileService.parseStringToInt(""+valeur), etat : this.listDemandeRdvSearch.etat};
    this.listDemandeRdv = {data : [],page : 0, libeller : '', colone : 'nomVaccinodrome',status : 1,totalpage : 0};
    this.getDataListDemandeRdv(0);
  }
  onChangeLibellerSearch(valeur){
    this.listDemandeRdvSearch = { libeller : valeur, colone : this.listDemandeRdvSearch.colone,ordre : this.listDemandeRdvSearch.ordre, status : this.listDemandeRdvSearch.status, etat : this.listDemandeRdvSearch.etat};
    this.listDemandeRdv = {data : [],page : 0, libeller : '', colone : 'nomVaccinodrome',status : 1,totalpage : 0};
  }
  searchDataInList(){
    let searchData = this.listDemandeRdvSearch;
    if(this.utileService.verifString(searchData.libeller)){
      this.listDemandeRdv = {data : [],page : 0, libeller : '', colone : 'nomVaccinodrome',status : 1,totalpage : 0};
      this.listDemandeRdvSearch = { libeller : searchData.libeller, colone : searchData.colone,ordre : searchData.ordre, status : searchData.status, etat : true};
      this.getDataListDemandeRdv(0);
    }else{
        alert("La liste c'est actualiser car le champs recherche est vide");
        this.refreshList();
    }
  }
  refreshList(){
    this.listDemandeRdv = {data : [],page : 0, libeller : '', colone : 'nomVaccinodrome',status : 1,totalpage : 0};
    this.listDemandeRdvSearch = { libeller : '', colone : 'nomVaccinodrome',ordre : false, status : 1, etat : false};
    this.getDataListDemandeRdv(0);
  }
  paginationListeDemandeRdv(){
    console.log('mm : ',this.sPage);
    this.getDataListDemandeRdv(this.sPage)
  }
  deleteRdvStatusOne(idDemandeRdv){
    if(idDemandeRdv>0 && confirm("Êtes-vous certain de vouloir supprimer ces informations")){
        this.requeteService.getRequeteGet('demanderdv/delete-demande-rdv-status-one/'+idDemandeRdv).subscribe((response:any)=>{
          if(response!==null && response!==undefined){
            alert(""+response.message);
            this.refreshList()
          }else{
            alert("Le serveur est hors-service");
          }
        },(errorResponse)=>{
          alert("Erreur d'information.")
        });
    }
  }
  // delete rdv where status = 1
  deleteRdvStatusTwo(idDemandeRdv){
    if(idDemandeRdv>0 && window.confirm("Demander l'annulation du rendez-vous envoyé dans le vaccinodrome concerné ?")){
      this.requeteService.getRequeteGet('demanderdv/delete-demande-rdv-status-two/'+idDemandeRdv).subscribe((response:any)=>{
        if(response!==null && response!==undefined){
          alert(""+response.message);
          this.refreshList()
        }else{
          alert("Le serveur est hors-service");
        }
      },(errorResponse)=>{
        alert("Erreur d'information.")
      });
    }
  }
  // delete rdv where status = 1
  restaurationDemandeRdvAnnuler(idDemandeRdv){
    if(idDemandeRdv>0 && window.confirm("Êtes-vous certain de vouloir supprimer ces informations ?")){
      this.requeteService.getRequeteGet('demanderdv/restauration-demande-rdv/'+idDemandeRdv).subscribe((response:any)=>{
        if(response!==null && response!==undefined){
          alert(""+response.message);
          this.refreshList()
        }else{
          alert("Le serveur est hors-service");
        }
      },(errorResponse)=>{
        alert("Erreur d'information.")
      });
    }
  }
  //get data information by id demande rdv
  getInfoUtilisateurByIdDemande(iddemanderdv){
    this.requeteService.getRequeteGet('utilisateur/info-utilisateur/'+iddemanderdv).subscribe((response:any)=>{
      if(response!==null && response!==undefined){
        if(response.status===200){
          console.log('data : ',response);
          this.infoDemandeRdv = response;
        }else{
            alert("Le serveur est hors service.");
        }
      }else{
        alert("Le serveur est hors-service");
      }
    },(errorResponse)=>{
      alert("Erreur d'information.")
    });
  }
  //voir le détail du demande de rendez-vous
  voirDetailDeRdv(iddemanderdv){
    if(iddemanderdv>0){
      this.stepper = 2;
      this.getInfoUtilisateurByIdDemande(iddemanderdv);
    }else{
      alert("Erreur d'information.");
    }
  }
  //voir le détail du demande de rendez-vous
  ajouterNouvelleDemandeRdv(){
    this.getInfoUtilisateur();
    this.stepper = 3;
  }
  //voir le détail du demande de rendez-vous
  setStepper(step){
    this.stepper = step;
  }
  getLocalisationVaccinodrome(valeur:string){
    let data = valeur.split('///');
    return data;
  }
  getAffichageHoraireVaccinodrome(debut:number,fin:number){
    if(debut>0 && fin>0){
      return debut+"h à "+fin+"h";
    }
    return "INDISPONIBLE";
  }
  changeSelectFamille(valeur){
    this.familleAdd = valeur;
  }
  //change date rdv en date normal
  getVerificationDayIfNotDisponible(horaireVaccinodrome,day){
    let size = horaireVaccinodrome.length;
    for(let i = 0; i < size; i++){
        if(horaireVaccinodrome[i].jour===day && horaireVaccinodrome[i].status===0){
            return true;
        }
    }
    return false;
  }
  setDateRdv(horaireVaccinodrome){
      let dateDemandeRdv = this.dateRdv;
      if(this.utileService.verifString(dateDemandeRdv)){
          let date = new Date(dateDemandeRdv); let now = new Date();let day = date.getDay();
          if(now>date){
              return 'Vous dévez selectionné une date superieur à '+this.utileService.getDateCompletAuJourdui();
          }
          if(this.getVerificationDayIfNotDisponible(horaireVaccinodrome,day)){
              return "La date '"+this.utileService.getDateComplet(dateDemandeRdv)+"' est invalide car le jour "+this.week[day]+" est indisponble dans l'emploi du temps du vaccinodrome";
          }
          return 'Rendez-vous fixé le '+this.utileService.getDateComplet(dateDemandeRdv);
      }
      return "";
  }
  changeDoseRdv(valeur){
    this.doseRdv = valeur;
  }
  setDateRdvConf(dateDemandeRdv,horaireVaccinodrome){
      if(this.utileService.verifString(dateDemandeRdv)){
          let date = new Date(dateDemandeRdv); let now = new Date();let day = date.getDay();
          if(now>date){
              return false;
          }
          if(this.getVerificationDayIfNotDisponible(horaireVaccinodrome,day)){
              return false;
          }
          return true;
      }
      return false
  }
  enregistrerRdv(infoVaccinUser,vaccin,vaccinodrome,vaccinCentre,utilisateur,famille,horaireVaccinodrome){
    let aQuiDemandeRdv = this.utileService.parseStringToInt(this.familleAdd);
    let dateDemandeRdv = this.dateRdv;let doseDemandeRdv = this.utileService.parseStringToInt(this.doseRdv);
    let descriptionDemandeRdv = this.description;let verifDate = this.setDateRdvConf(dateDemandeRdv,horaireVaccinodrome);
    if(infoVaccinUser!==null && infoVaccinUser!==undefined && vaccin!==null && vaccin!==undefined && vaccinodrome!==null && vaccinodrome!==undefined && 
      vaccinCentre!==null && vaccinCentre!==undefined && utilisateur!==null && utilisateur!==undefined && famille.length>=0 && this.utileService.verifString(dateDemandeRdv) && 
      verifDate &&  aQuiDemandeRdv>0 && aQuiDemandeRdv<3 && doseDemandeRdv>0){
        let size = famille.length;
        let listfamille = []; 
        if(aQuiDemandeRdv===2){
            for(let i = 0; i < size; i++){
                listfamille.push({
                    idRdvFamille : 0,
                    idDemandeRdv : 0,
                    idFamille : famille[i].idFamille,
                    status : 1
                });
            }
        }
        let data = {
            demandeRdv : {
                idDemandeRdv : 0,
                idInfovaccinuser : infoVaccinUser.idInfoVaccinUser,
                dose : doseDemandeRdv,
                dateRdv : dateDemandeRdv,
                famille : aQuiDemandeRdv,
                descriptions : descriptionDemandeRdv,
                status : 1
            },
            famille : listfamille
        }
        this.requeteService.getRequetePost('demanderdv/demande-rdv-patient',data).subscribe((response:any)=>{
          if(response!==null && response!==undefined){
            alert(""+response.message);
            this.refreshList();
          }else{
            alert("Le serveur est hors-service");
          }
        },(errorResponse)=>{
          alert("Erreur d'information.")
        });
    }else{
      alert('Les informations sont incomplètes, merci de compléter tous les champs.')
    }
  }
  onChangeVaccinodrome(){
    this.stepper = 4;
  }
  // //data vaccincentreview to display list
  // getVerificationDataPageVaccinCentreView(page){
  //   let data = this.dataListVaccinCentreView.data;let size =  data.length;
  //   if(size > 0){
  //       for (let i = 0; i < size; i++) {
  //           if(data.page === page){
  //             this.dataListVaccinCentreView = {data : this.dataListVaccinCentreView.data,page : page, libeller : this.dataListVaccinCentreView.libeller, colone : this.dataListVaccinCentreView.colone};
  //             return true;
  //           }
  //       }
  //       return false;
  //   }
  //   return false;
  // }
  // getDataVaccinCentreView(page){
  //     let idvaccin = this.dataVaccinInscriptionPatient.idVaccin;let etatsearch = this.etatsearch;
  //     if(idvaccin!==undefined && idvaccin!==null && idvaccin>0){
  //       if(!this.getVerificationDataPageVaccinCentreView(page)){
  //         let dataSearchListVaccinCentreView = this.state.dataSearchListVaccinCentreView;
  //         let url = "vaccincentre/";let libeller =  dataSearchListVaccinCentreView.libeller;
  //         if(dataSearchListVaccinCentreView.etat && utile.getVerificationChampsText(libeller)){url=url+"searchbyidvaccin/"+idvaccin+"/10/"+page+"/"+libeller;}else{url=url+"listbyidvaccin/"+idvaccin+"/10/"+page;}
  //         this.setState({activeloader : true});
  //         fetchGet(url).then(response=>{ 
  //             this.setState({activeloader : false});
  //             if(response !== undefined && response!==null){
  //                 let dataListVaccinCentreView = this.state.dataListVaccinCentreView;let tmp= dataListVaccinCentreView.data;let size = tmp.length;let test = false;
  //                 for(let i = 0; i < size; i++){ if(tmp[i].page === page){test= true; break; } }
  //                 if(!test){ tmp.push({docs : response.docs,page : response.page}); }
  //                 this.setState({dataListVaccinCentreView : {data : tmp,page : response.page, libeller : dataListVaccinCentreView.libeller, colone : dataListVaccinCentreView.colone,totalpage : response.totalPages}});
  //             }
  //         });
  //       }
  //     }
  // }
  // getDataVaccinCentreViewInState(dataListVaccinCentreView){
  //     let data = dataListVaccinCentreView.data;let page = dataListVaccinCentreView.page;let size = data.length;
  //     if(size > 0){
  //         for (let i = 0; i < size; i++) {
  //             if(data[i].page === page){
  //                 return data[i].docs;
  //             }
  //         }
  //         return [];
  //     }
  //     return [];
  // }
}
