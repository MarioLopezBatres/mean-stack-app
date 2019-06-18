import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthData } from "../models/auth-data.model";
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
  // Should be substituted by User Model
  private userId: string;

  constructor(private httpClient: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  // Returns the status (Log in/out) as an observable to get the value
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.httpClient
      .post("http://localhost:3000/api/user/signup", authData)
      .subscribe(
        () => {
          this.router.navigate(["/"]);
        },
        error => {
          this.authStatusListener.next(false);
        }
      );
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    // Response in user.ts is res.status(200)... token
    // ExpiresIn comes from user.js
    this.httpClient
      .post<{ token: string; expiresIn: number; userId: string }>(
        "http://localhost:3000/api/user/login",
        authData
      )
      .subscribe(
        response => {
          const token = response.token;
          this.token = token;
          // Content could be null even with the possitive subscribe
          if (token) {
            const expiresInDuration = response.expiresIn;
            // set timer for logout
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            // extracting user id
            this.userId = response.userId;
            this.authStatusListener.next(true);
            // Save the expiration date locally to keep it after reloading page
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            console.log(expirationDate);
            this.saveAuthData(token, expirationDate, this.userId);
            this.router.navigate(["/"]);
          }
        },
        error => {
          this.authStatusListener.next(false);
        }
      );
  }

  // Automatically authenticate an user
  // Run in app.component
  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    // Date in future - Auth when reload
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    // Push the new value to the listeners
    this.authStatusListener.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    // Reset userId
    this.clearAuthData();
    this.router.navigate(["/"]);
  }

  // Keep logged in when reload page
  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("userId", userId);
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
  }

  // Get local variables
  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    };
  }

  private setAuthTimer(duration: number) {
    console.log("Setting timer: " + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
      // it works in milliseconds and not in seconds
    }, duration * 1000);
  }
}
