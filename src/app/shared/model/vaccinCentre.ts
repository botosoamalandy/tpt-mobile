export class VaccinCentre {
  idVaccinCentre: number;
  idVaccinodrome: number;
  idVaccin: number;
  nomVaccin: string;
  urlPhoto: string;
  quantite: number;
  nombreDose: number;
  ageMinimum: number;
  descriptions: string;
  status: number;
  nomCentre: string;
  localisation: string;
  email: string;
  telephone: string;
  adresse: string;
  imgvaccinodrome: string;

  public constructor(init?: Partial<VaccinCentre>) {
    Object.assign(this, init);
  }

}
