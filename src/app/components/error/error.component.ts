import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material";

@Component({
  //selector: "app-error",
  templateUrl: "./error.component.html",
  styleUrls: ["./error.component.css"]
})

// Added to entryComponents in app.module
export class ErrorComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }) {}

  ngOnInit() {}
}
