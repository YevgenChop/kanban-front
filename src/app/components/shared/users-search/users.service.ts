import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, firstValueFrom } from 'rxjs';
import { IUserSearchResult } from '../../../models/user-search-result.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

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
        .pipe(catchError(this.handleError))
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
}
