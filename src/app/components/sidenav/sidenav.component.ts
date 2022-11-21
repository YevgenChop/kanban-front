import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit {
  public isMobile!: boolean;
  ngOnInit() {
    this.isMobile = window.innerWidth < 768;
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isMobile = window.innerWidth < 768;
  }
}
