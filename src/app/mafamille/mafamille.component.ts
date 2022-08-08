import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { RequeteService } from '../service/requete.service';
import { UtileService } from '../service/utile.service';
import { BrowserModule } from '@angular/platform-browser';
import { Famille } from '../shared/model/utilisateur';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-mafamille',
  templateUrl: './mafamille.component.html',
  styleUrls: ['./mafamille.component.scss'],
})
@NgModule({
  imports: [
      CommonModule,
      BrowserModule
  ]
})
export class MafamilleComponent implements OnInit {
  listFamille:any = {data : [],page : 0,totalpage : 0};listDataFamille:Famille[]=[];nnn = ["1","2","3","4"]
  constructor(private requeteService:RequeteService,private authService:AuthService,private utileService: UtileService) { }

  ngOnInit() {
    this.getFamille(0);
  }
  //data famille
  getVerificationDataPageFamille(page){
    let data = this.listFamille.data;let size =  data.length;
    if(size > 0){
        for (let i = 0; i < size; i++) {
            if(data.page === page){
              this.listFamille = {data : this.listFamille.data,page : this.listFamille.page,totalpage : this.listFamille.totalpage};
              return true;
            }
        }
        return false;
    }
    return false;
  }
  getDataFamilleInState(listFamille){
    let data = listFamille.data;let page = listFamille.page;let size = data.length;
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
  getFamille(page){
    if(!this.getVerificationDataPageFamille(page)){
      this.requeteService.getRequeteGet("famille/list/10/"+page).subscribe((response:any)=>{
        if(response!==null && response!==undefined){
          let tmp= this.listFamille.data;let size = tmp.length;let test = false;
          for(let i = 0; i < size; i++){ if(tmp[i].page === page){test= true; break; } }
          if(!test){ tmp.push({docs : response.docs,page : response.page}); }
          this.listFamille = {data : tmp,page : response.page,totalpage : response.totalPages};
          this.listDataFamille = this.getDataFamilleInState(this.listFamille);
          console.log('list : ',this.listFamille);
          console.log('listDataFamille : ',this.listDataFamille);
          console.log(JSON.stringify(this.listDataFamille));
        }else{
          alert("Le serveur est hors-service");
        }
      },(errorResponse)=>{
        alert("Erreur d'information.")
      });
    }
  }
  getDataHtmlEviterUndifined(valeur){
    if(valeur!==null && valeur!==undefined){
      return valeur;
    }
    return "";
  }
}
