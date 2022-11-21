import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, firstValueFrom, tap } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { ICreateStatusData, IStatus } from '../../../../models/status.model';
import { StatusesStore } from '../../../../store/statuses.store';

@Injectable({
  providedIn: 'root',
})
export class StatusService {
  constructor(private http: HttpClient, private statusesStore: StatusesStore) {}

  public createStatus(statusData: ICreateStatusData): Promise<IStatus> {
    return firstValueFrom(
      this.http
        .post<IStatus>(`${environment.apiUrl}/status`, { ...statusData })
        .pipe(
          catchError(this.handleError),
          tap((status) => {
            this.statusesStore.statuses$.next([
              status,
              ...this.statusesStore.statuses,
            ]);
          })
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
}
