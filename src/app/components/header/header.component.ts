import { Component } from '@angular/core';
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
  ) {}

  public async logout(): Promise<void> {
    await this.authService.logout();
  }
}
