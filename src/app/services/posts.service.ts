import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Post } from "../components/posts/post.model";
import { Subject } from "rxjs";
// Transforms elements from array
import { map } from "rxjs/operators";
import { PostListComponent } from "../components/posts/post-list/post-list.component";
import { Router } from "@angular/router";

//INJECTABLE MAKES NOT NEEDED TO ADD IT TO APP MODULE
@Injectable({
  providedIn: "root"
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();

  constructor(private httpClient: HttpClient, private router: Router) {}

  // has a message cause it has been defined in the server
  // pagesize and page have been defined in posts.js
  getPosts(postsPerPage: number, currentPage: number) {
    // Pagination
    // ´´ allows to add paramaters to a string
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.httpClient
      .get<{ message: string; posts: any; maxPosts: number }>(
        "http://localhost:3000/api/posts" + queryParams
      ) // The pipe could be removed changing post.models.ts to _id (mongoose devuelve _id)
      .pipe(
        map(postData => {
          return {
            posts: postData.posts.map(post => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath
              };
            }),
            maxPosts: postData.maxPosts
          };
        })
      )
      // .subscribe(new date, error, success)
      // if there is not data postData => ... = postData.posts and not transformedPost
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.httpClient.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
    }>("http://localhost:3000/api/posts/" + id);
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    // image is defined as argument in posts.js within multer({storage:storage}).single("image")
    postData.append("image", image, title);

    this.httpClient
      .post<{ message: string; post: Post }>(
        "http://localhost:3000/api/posts",
        postData
      )
      .subscribe(res => {
        this.router.navigate(["/"]);
      });
  }

  deletePost(postId: string) {
    return this.httpClient.delete("http://localhost:3000/api/posts/" + postId);
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    // We can not check if it is a File but an object
    if (typeof image === "object") {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      // title is full name
      postData.append("image", image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image
      };
    }

    this.httpClient
      .put("http://localhost:3000/api/posts/" + id, postData)
      .subscribe(res => {
        // No need to update variables cause we reload the page and onInit() re-fetch the variable
        this.router.navigate(["/"]);
      });
  }
}
