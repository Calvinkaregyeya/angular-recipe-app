export class User {
  constructor(
    public email: string,
    public id: string,
    private _token: string,
    private _TokenExpirationDate: Date
  ) {}

  get token() {
    if (!this._TokenExpirationDate || new Date() > this._TokenExpirationDate) {
      return null;
    }
    return this._token;
  }
}
