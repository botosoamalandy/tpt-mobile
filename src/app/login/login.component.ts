import {Component, OnInit} from '@angular/core';
import { RequeteService } from '../service/requete.service';
import {UtileService} from '../service/utile.service';
import {AuthService} from '../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  numero:string;mdp:string;

  constructor(private utileService: UtileService, private requeteService:RequeteService,private authService:AuthService) {
  }

  ngOnInit() {
    
  }
  connect() {
    if (this.utileService.verifString(this.numero) && this.utileService.verifString(this.mdp)) {
      const data={telephone : this.numero,mot_de_passe : this.mdp,status:100};
      this.requeteService.getRequetePost('utilisateur/login-utilisateur',data).subscribe((response:any)=>{
        if(response!==null && response!==undefined){
          if(response.status===200){
            let verification = this.authService.getVerifToken(response.token);
            if(verification){ 
              let utilisateur = this.authService.getDataUtilisateurByToken(response.token);
              console.log('utilisateur : ',utilisateur)
              if(utilisateur.codeutilisateur===100){
                  this.authService.authentificationUtilisateur(response.token);
                  window.location.replace('/user-profile');
              }
            }else{
                alert('Les informations sont incomplètes, merci de compléter tous les champs.');
            }
          }else{
            alert(""+response.message);
          }
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

}
