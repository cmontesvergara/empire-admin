import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    standalone: true,
    imports: [RouterOutlet],
})
export class ProfileComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
