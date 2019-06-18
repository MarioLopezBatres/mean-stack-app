import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";

// Header Authorization (name applied) MUST be add to app.js
// Interceptors works as services, but it must be add to app.module as provider
@Injectable()
// Interceptors take a request and it intercepts it to mold it
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Retrieve token from server
    const authToken = this.authService.getToken();
    // Clone the request before manipulating. Recommended
    const AuthRequest = req.clone({
      // set() adds one header or edit the existing one
      // authorization comes from check-auth.js but it is case insensitive, as Bearer does
      headers: req.headers.set("Authorization", "Bearer " + authToken)
    });

    return next.handle(AuthRequest);
  }
}
