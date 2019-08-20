import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
//FormsModule for normal forms. [ngModel] does not work on reactive
import { FormsModule } from "@angular/forms";

import { SignupComponent } from "./signup/signup.component";
import { LoginComponent } from "./login/login.component";
import { AngularMaterialModule } from "src/app/angular-material.module";
import { AuthRoutingModule } from "./auth-routing";

@NgModule({
  declarations: [SignupComponent, LoginComponent],
  imports: [AuthRoutingModule, CommonModule, AngularMaterialModule, FormsModule]
})
export class AuthModule {}
