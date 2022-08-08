export class Utilisateur {
  idutilisateur: number;
  idtypeutilisateur: number;
  nom: string;
  sexe: number;
  naissance: string;
  email: string;
  telephone: string;
  mot_de_passe: string;
  urlPhoto: string;
  date_ajout: string;
  status: number;
  public constructor(init?: Partial<Utilisateur>) {
    Object.assign(this, init);
  }
}


export class Famille {
  idFamille: number;
  idUtilisateur: number;
  naissance: string;
  nom: string;
  positionFamilliale: string;
  sexe: number;
  status: number;
  urlPhoto: string;
}
export class InfoVaccinUser {
  idInfoVaccinUser: number;
  idUtilisateur: number;
  idVaccinCentre: number;
  idVaccinodrome: number;
  idVaccin: number;
  status: number;
}
