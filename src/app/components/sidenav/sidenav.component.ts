import {
  AfterViewInit,
  Component,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { filter, takeUntil } from 'rxjs';
import { UiComponent } from '../../abstract/ui-component.component';
import { AuthUserStore } from '../../store/auth-user.store';
import { AuthService } from '../auth/services/auth.service';
import { SidenavService } from './services/sidenav.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent
  extends UiComponent
  implements OnInit, AfterViewInit
{
  @ViewChild('drawer') set viewDrawer(drawer: MatDrawer) {
    this.drawer = drawer;
  }

  private breakpoint = 768;
  public isMobile!: boolean;
  public authUser$ = this.authUserStore.authUser$;
  public clickedButton!: string;
  public drawer!: MatDrawer;

  constructor(
    private authService: AuthService,
    private router: Router,
    private authUserStore: AuthUserStore,
    private sidenavService: SidenavService
  ) {
    super();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isMobile = window.innerWidth < this.breakpoint;
  }

  ngAfterViewInit() {    
    this.sidenavService.setSidenav(this.drawer);
  }

  ngOnInit() {
    this.isMobile = window.innerWidth < this.breakpoint;
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        ),
        takeUntil(this.notifier$)
      )
      .subscribe((event: NavigationEnd) => (this.clickedButton = event.url));
  }

  public logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('auth/login');
  }
}
