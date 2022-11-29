import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthUserStore } from '../store/auth-user.store';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authUserStore: AuthUserStore, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.authUserStore.authUser$.pipe(
      map(
        (u) =>
          !!u ||
          this.router.createUrlTree(['/auth/login'], {
            queryParams: { returnUrl: state.url },
          })
      )
    );
  }
}
