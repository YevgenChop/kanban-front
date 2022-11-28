import {
  Component,
  HostListener,
} from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { filter, takeUntil } from 'rxjs';
import { UiComponent } from 'src/app/abstract/ui-component.component';
import { AuthUserStore } from '../../store/auth-user.store';
import { AuthService } from '../auth/services/auth.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent extends UiComponent {
  public isMobile!: boolean;
  public authUser$ = this.authUserStore.authUser$;
  public clickedButton!: string;
  public drawer!: MatDrawer;

  constructor(
    private authService: AuthService,
    private router: Router,
    private authUserStore: AuthUserStore,
  ) {
    super();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isMobile = window.innerWidth < 768;
  }

  ngOnInit() {
    this.isMobile = window.innerWidth < 768;
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
