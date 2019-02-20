import { Component, OnInit } from '@angular/core';
import { ShareService } from '../share/share.service';
import {SlideAnimation} from '../share/app-animation';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [SlideAnimation]
})
export class HomeComponent implements OnInit {
  showSideBar: boolean = false;

  constructor(private shareService: ShareService) { }

  ngOnInit() {
    this.shareService.getSubjectValue().subscribe( (data: boolean) => {
      this.showSideBar = data;
    });
  }

  sideBarToggle() {
    this.showSideBar === true ? this.showSideBar = false : this.showSideBar = true;
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

}
