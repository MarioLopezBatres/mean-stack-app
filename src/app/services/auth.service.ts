import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthData } from "../components/auth/auth-data.model";
import { Subject } from "rxjs";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private tokenTimer: any;

  constructor(private httpClient: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  // Returns the status (Log in/out) as an observable to get the value
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.httpClient
      .post("http://localhost:3000/api/user/signup", authData)
      .subscribe(response => {
        console.log(response);
      });
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };

    // Response in user.ts is res.status(200)... token
    // ExpiresIn comes from user.js
    this.httpClient
      .post<{ token: string; expiresIn: number }>(
        "http://localhost:3000/api/user/login",
        authData
      )
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        // Content could be null even with the possitive subscribe
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.tokenTimer = setTimeout(
            () => {
              this.logout();
            },
            // it works in milliseconds and not in secconds
            expiresInDuration * 1000
          );
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          this.router.navigate(["/"]);
        }
      });
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    // Push the new value to the listeners
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.router.navigate(["/"]);
  }
}
