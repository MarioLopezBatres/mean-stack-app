import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { Post } from "../../../models/post.model";
import { PostsService } from "../../../services/posts.service";
import { PageEvent } from "@angular/material";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"]
})
export class PostListComponent implements OnInit, OnDestroy {
  // ONLY FROM DIRECT FATHER
  posts: Post[] = [];
  isLoading = false;
  // Pagination
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;

  private postsSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    public postsService: PostsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    // start in page 1
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    // Get UserId (User Model)
    this.userId = this.authService.getUserId();
    // This is not needed if in the post-create just return this.posts
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((postData: { posts: Post[]; postCount: number }) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
      });
    // We get this value to keep the login activated for buttons edit/delete
    this.userIsAuthenticated = this.authService.getIsAuth();
    // Check status of Log in/out for Logout button
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        // Update UserId (User Model)
        this.userId = this.authService.getUserId();
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(
      () => {
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
      },
      // IMPORTANT! Way to communicate that the value of one variable has changed from a subscribe
      () => {
        this.isLoading = false;
      }
    );
  }

  // Used for destroying the listener
  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
