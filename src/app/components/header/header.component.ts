import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthUserStore } from '../../store/auth-user.store';
import { AuthService } from '../auth/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  public authUser$ = this.authUserStore.authUser$;

  constructor(
    private authUserStore: AuthUserStore,
    private authService: AuthService,
    private router: Router
  ) {}

  public logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('auth/login');
  }
}
