export class Auth {
  iss: string;
  nom: string;
  email: string;
  expiration: Date | number;

  public constructor(init?: Partial<Auth>) {
    Object.assign(this, init);
  }
}

