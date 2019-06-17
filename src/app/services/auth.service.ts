import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthData } from "../components/auth/auth-data.model";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  constructor(private httpClient: HttpClient) {}

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

    this.httpClient
      .post("http://localhost:3000/api/user/login", authData)
      .subscribe(response => {
        console.log(response);
      });
  }
}
