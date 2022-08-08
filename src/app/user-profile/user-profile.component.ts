import { Component, OnInit } from '@angular/core';
import {Utilisateur} from '../shared/model/utilisateur';
import {AuthService} from '../service/auth.service';
import { RequeteService } from '../service/requete.service';
import { UtileService } from '../service/utile.service';
import axios from 'axios';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  utilisateur: Utilisateur;stepper:number = 1;
  nomUser:string = "";
  sexeUser:string = "1";
  naissanceUser:string="";
  emailUser:string = "";
  telephoneUser:string = "";
  photoUser:any =null;

  constructor(private requeteService:RequeteService,private authService:AuthService,private utileService: UtileService) { }

  ngOnInit() {
    this.getUtilisateurById();
  } 
  getUtilisateurById(){
    let dataToken = this.authService.getDataUtilisateurToken();
    if(dataToken!==null && dataToken!==undefined){
      let idutilisateur = this.utileService.parseStringToInt(dataToken.id);
      if(idutilisateur!==undefined && idutilisateur!==null && idutilisateur>0){
        this.requeteService.getRequeteGet('utilisateur/byid/'+idutilisateur).subscribe((response:any)=>{
          if(response!==null && response!==undefined){
            this.utilisateur=response;
          }else{
            alert("Le serveur est hors-service");
          }
        },(errorResponse)=>{
          alert("Erreur d'information.")
        });
      }
    }
  }
  getDateCompletByNaissance(){
    return this.utileService.getDateComplet(this.utilisateur.naissance)
  }
  getDateNormal(date:string){
    this.utileService.getDateFormatNormal(date)
  }
  setStepper(valeur:number){
    if(valeur===2){
      this.nomUser = this.utilisateur.nom;
      this.sexeUser = ""+this.utilisateur.sexe;
      this.naissanceUser = this.utileService.getDateFormatNormal(this.utilisateur.naissance);
      this.emailUser = this.utilisateur.email;
      this.telephoneUser = this.utilisateur.telephone;
    }
    this.stepper = valeur;
  }
  changeImageUtilisateur($event){
    let files = $event.target.files;
      if(files.length >0){
          let size = files[0].size/1024;
          if(size<=1000){
              if(this.utileService.getVerifiExtensionImage(files[0].name)){
                console.log("photoUser : ",files[0]);
                  this.photoUser = files[0];
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
  enregistrerUserData(){
    let sexe = this.utileService.parseStringToInt(this.sexeUser);
    if(!this.utileService.verifString(this.nomUser)){this.nomUser = this.utilisateur.nom;}
    if(sexe>0 && sexe<3){sexe = this.utilisateur.sexe;}
    if(!this.utileService.verifString(this.naissanceUser)){this.naissanceUser = this.utilisateur.naissance;}
    if(!this.utileService.verifString(this.emailUser)){this.emailUser = this.utilisateur.email;}
    if(!this.utileService.verifString(this.telephoneUser)){this.telephoneUser = this.utilisateur.telephone;}
    if(this.photoUser!==null && this.photoUser!==undefined){
      const dataPhoto = new FormData() 
      dataPhoto.append('photo', this.photoUser)
      axios.post(this.requeteService.getUrlNodeJs()+"photo", dataPhoto).then(res => { 
          if(res.data!==null && res.data!==undefined){
              let imageUrl = res.data.image;
              if(imageUrl!==null && imageUrl!==undefined && imageUrl!==''){
                  let data ={
                      idutilisateur : this.utilisateur.idutilisateur,
                      idtypeutilisateur : this.utilisateur.idtypeutilisateur,
                      nom : this.nomUser,
                      sexe : sexe,
                      naissance : this.naissanceUser,
                      email : this.emailUser,
                      telephone : this.telephoneUser,
                      mot_de_passe : this.utilisateur.mot_de_passe,
                      urlPhoto : imageUrl,
                      date_ajout : this.utilisateur.date_ajout,
                      status : 1,
                  };
                  this.requeteService.getRequetePost('utilisateur/update-patient',data).subscribe((response:any)=>{
                    if(response!==null && response!==undefined){
                      this.getUtilisateurById()
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
      let data ={
        idutilisateur : this.utilisateur.idutilisateur,
        idtypeutilisateur : this.utilisateur.idtypeutilisateur,
        nom : this.nomUser,
        sexe : sexe,
        naissance : this.naissanceUser,
        email : this.emailUser,
        telephone : this.telephoneUser,
        mot_de_passe : this.utilisateur.mot_de_passe,
        urlPhoto : this.utilisateur.urlPhoto,
        date_ajout : this.utilisateur.date_ajout,
        status : 1,
      };
      this.requeteService.getRequetePost('utilisateur/update-patient',data).subscribe((response:any)=>{
        if(response!==null && response!==undefined){
          this.getUtilisateurById()
          alert(""+response.message);
        }else{
          alert("Le serveur est hors-service");
        }
      },(errorResponse)=>{
        alert("Erreur d'information.")
      });
    }
  }
}
