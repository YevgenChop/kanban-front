import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, firstValueFrom, tap } from 'rxjs';
import { ErrorHandlingService } from '../../../shared/services/error-handling.service';
import { environment } from '../../../../environments/environment';
import { IUpdateUserData } from '../../../models/auth-user.model';
import { AuthUserStore } from '../../../store/auth-user.store';
import { IUserSearchResult } from '../../../models/user-search-result.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private http: HttpClient,
    private authUserStore: AuthUserStore,
    private errorService: ErrorHandlingService
  ) {}

  public getUsers(options: {
    term: string;
    boardId?: string;
    skipUserIds?: string[];
  }): Promise<IUserSearchResult[]> {
    let queryParams = `term=${options.term}`;

    queryParams = options.boardId
      ? queryParams + `&boardId=${options.boardId}`
      : queryParams;

    if (options.skipUserIds?.length) {
      for (const id of options.skipUserIds) {
        queryParams = `${queryParams}&skipUserIds[]=${id}`;
      }
    }

    return firstValueFrom(
      this.http
        .get<IUserSearchResult[]>(
          `${environment.apiUrl}/user/search?${queryParams}`
        )
        .pipe(catchError(this.errorService.handleError))
    );
  }

  public updateUser(userData: IUpdateUserData): Promise<void> {
    return firstValueFrom(
      this.http.patch<void>(`${environment.apiUrl}/user`, { ...userData }).pipe(
        catchError(this.errorService.handleError),
        tap(() => this.handleUpdate(userData))
      )
    );
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
