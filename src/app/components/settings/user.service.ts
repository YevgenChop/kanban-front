import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, firstValueFrom, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IUpdateUserData } from '../../models/auth-user.model';
import { AuthUserStore } from '../../store/auth-user.store';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient, private authUserStore: AuthUserStore) {}

  public updateUser(userData: IUpdateUserData): Promise<void> {
    return firstValueFrom(
      this.http.patch<void>(`${environment.apiUrl}/user`, { ...userData }).pipe(
        catchError(this.handleError),
        tap(() => this.handleUpdate(userData))
      )
    );
  }

  private handleError(error: HttpErrorResponse): Promise<never> {
    let errorMessage = 'An unknown error occured...';

    if (error && error.error.message) {
      errorMessage = Array.isArray(error.error.message)
        ? error.error.message.join(', ')
        : error.error.message;
    }

    return Promise.reject(errorMessage);
  }

  private handleUpdate(userData: IUpdateUserData): void {
    const updatedUser = this.authUserStore.authUser;
    if (!updatedUser) return;

    for (const property in userData) {
      const prop = property as keyof IUpdateUserData;
      updatedUser[prop] = userData[prop] || updatedUser[prop];
    }

    this.authUserStore.authUser$.next(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }
}
