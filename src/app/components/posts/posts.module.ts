import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";

import { PostCreateComponent } from "./post-create/post-create.component";
import { PostListComponent } from "./post-list/post-list.component";
import { AngularMaterialModule } from "src/app/angular-material.module";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [PostCreateComponent, PostListComponent],
  imports: [
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule
  ]
})
export class PostsModule {}
