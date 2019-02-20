import {Component, OnInit, HostListener, AfterViewInit} from '@angular/core';
import { ShareService } from '../share/share.service';
import {Router, Event, NavigationStart} from '@angular/router';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.css']
})

export class AsideComponent implements OnInit, AfterViewInit  {
  newInnerWidth: number;

  constructor(private shareService: ShareService, private router: Router) { }

  ngOnInit() {
    this.router.events.subscribe( (event: Event) => {
      if (event instanceof NavigationStart && this.newInnerWidth < 991) {
        this.shareService.sendBooleanValue(false);
      }
    });
  }

  ngAfterViewInit() {
    this.newInnerWidth = window.innerWidth;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.newInnerWidth = event.srcElement.innerWidth;
  }

}
