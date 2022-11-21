import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { AuthUserStore } from '../../store/auth-user.store';
import { AuthService } from '../auth/services/auth.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit {
  @ViewChild('drawer') public drawer!: MatDrawer;
  public isMobile!: boolean;
  public authUser$ = this.authUserStore.authUser$;

  constructor(
    private authService: AuthService,
    private router: Router,
    private authUserStore: AuthUserStore
  ) {}

  ngOnInit() {
    this.isMobile = window.innerWidth < 768;
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isMobile = window.innerWidth < 768;
  }

  public logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('auth/login');
  }
}
