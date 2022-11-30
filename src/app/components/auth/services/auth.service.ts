import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { catchError, firstValueFrom, Observable, tap } from 'rxjs';
import { IAuthUser } from '../../../models/auth-user.model';
import { ILoginData, ISignupData } from '../../../models/sign-up-data.model';
import { AuthUserStore } from '../../../store/auth-user.store';
import { ErrorHandlingService } from '../../../shared/services/error-handling.service';
import { Router } from '@angular/router';
import { ITokens } from '../../../models/tokens.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private authUserStore: AuthUserStore,
    private errorService: ErrorHandlingService,
    private router: Router
  ) {}

  public async signUp(data: ISignupData): Promise<void> {
    await firstValueFrom(
      this.http.post<void>(`${environment.apiUrl}/user`, data).pipe(
        catchError(this.errorService.handleError),
        tap(() => localStorage.setItem('unverifiedEmail', data.email))
      )
    );
  }

  public async verifyUser(token: string): Promise<void> {
    await firstValueFrom(
      this.http
        .get<void>(`${environment.apiUrl}/auth/verify/?token=${token}`)
        .pipe(
          catchError(this.errorService.handleError),
          tap(() => localStorage.removeItem('unverifiedEmail'))
        )
    );
  }

  public async resendEmail(email: string): Promise<void> {
    await firstValueFrom(
      this.http
        .post<void>(`${environment.apiUrl}/auth/resend-email`, { email })
        .pipe(catchError(this.errorService.handleError))
    );
  }

  public async login(data: ILoginData): Promise<void> {
    await firstValueFrom(
      this.http
        .post<IAuthUser>(`${environment.apiUrl}/auth/login`, data)
        .pipe(
          tap(this.handleAuth.bind(this)),
          catchError(this.errorService.handleError)
        )
    );
  }

  private handleAuth(data: IAuthUser): void {
    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data));
    this.authUserStore.authUser$.next(data);
  }

  public autoLogin(): void {
    const userData = localStorage.getItem('user');

    if (userData) {
      this.authUserStore.authUser$.next(JSON.parse(userData));
    }
  }

  public async logout(): Promise<void> {
    try {
      await firstValueFrom(
        this.http.post<void>(`${environment.apiUrl}/auth/logout`, {})
      );
    } catch (error) {
      this.errorService.handleError(error as HttpErrorResponse);
    }

    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    this.authUserStore.authUser$.next(null);

    this.router.navigateByUrl('auth/login');
  }

  public refreshTokens(): Observable<ITokens> {
    return this.http
      .post<ITokens>(`${environment.apiUrl}/auth/refresh`, {})
      .pipe(
        catchError(this.errorService.handleError),
        tap(({ token, refreshToken }) =>
          this.handleAuth({
            ...this.authUserStore.authUser,
            token,
            refreshToken,
          } as IAuthUser)
        )
      );
  }
}
