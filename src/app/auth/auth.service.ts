import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { logging } from "protractor";
import { BehaviorSubject, Subject, throwError } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { User } from "./user.model";

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}
@Injectable({ providedIn: "root" })
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;
  constructor(private http: HttpClient, private router: Router) {}

  signUp(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAUy3QFIrhXeRddMOkujM74egwpyqrATgk",
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((response) => {
          this.handleAuthentication(
            response.email,
            response.localId,
            response.idToken,
            response.expiresIn
          );
        })
      );
  }

  logIn(email, password) {
    return this.http
      .post<AuthResponseData>(
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAUy3QFIrhXeRddMOkujM74egwpyqrATgk",
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((response) => {
          this.handleAuthentication(
            response.email,
            response.localId,
            response.idToken,
            response.expiresIn
          );
        })
      );
  }

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _TokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem("userData"));
    if (!userData) {
      return;
    }
    const currentUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._TokenExpirationDate)
    );

    if (currentUser.token) {
      const expirationDuration =
        new Date(userData._TokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
      this.user.next(currentUser);
    }
  }

  autoLogout(expirationNumber: number) {
    console.log(expirationNumber);
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationNumber);
  }

  logout() {
    this.user.next(null);
    this.router.navigate(["/auth"]);
    localStorage.removeItem("userData");
    clearTimeout(this.tokenExpirationTimer);
  }

  private handleAuthentication(
    email: string,
    id: string,
    token: string,
    expiresIn: string
  ) {
    const expiryDate = new Date(new Date().getTime() + +expiresIn * 1000);
    const currentUser = new User(email, id, token, expiryDate);
    this.user.next(currentUser);
    this.autoLogout(+expiresIn * 1000);
    localStorage.setItem("userData", JSON.stringify(currentUser));
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage;
    if (errorRes.error || errorRes.error.error) {
      switch (errorRes.error.error.message) {
        case "EMAIL_EXISTS":
          errorMessage = "This email already exists";
          break;
        case "EMAIL_NOT_FOUND":
          errorMessage = "This email doesnot exist";
          break;
        case "INVALID_PASSWORD":
          errorMessage = "This password is not correct";
          break;
        default:
          errorMessage = "An unknown error occurred";
          break;
      }
    }
    return throwError(errorMessage);
  }
}
