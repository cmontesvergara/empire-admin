import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
// import { NavbarComponent } from '../layout/components/navbar/navbar.component';

@Component({
    selector: 'app-apps',
    templateUrl: './apps.component.html',
    styleUrls: ['./apps.component.scss'],
    standalone: true,
    imports: [AngularSvgIconModule, RouterOutlet],
})
export class AppsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
