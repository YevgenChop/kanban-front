import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, firstValueFrom, tap } from 'rxjs';
import { ErrorHandlingService } from '../../../shared/services/error-handling.service';
import { environment } from '../../../../environments/environment';
import { ICreateStatusData, IStatus } from '../../../models/status.model';
import { StatusesStore } from '../../../store/statuses.store';

@Injectable({
  providedIn: 'root',
})
export class StatusService {
  constructor(
    private http: HttpClient,
    private statusesStore: StatusesStore,
    private errorService: ErrorHandlingService
  ) {}

  public createStatus(statusData: ICreateStatusData): Promise<IStatus> {
    return firstValueFrom(
      this.http
        .post<IStatus>(`${environment.apiUrl}/status`, { ...statusData })
        .pipe(
          catchError(this.errorService.handleError),
          tap((status) => {
            this.statusesStore.statuses$.next([
              status,
              ...this.statusesStore.statuses,
            ]);
          })
        )
    );
  }

  public deleteStatus(id: string): Promise<void> {
    return firstValueFrom(
      this.http.delete<void>(`${environment.apiUrl}/status/${id}`).pipe(
        catchError(this.errorService.handleError),
        tap(() => {
          this.statusesStore.statuses$.next(
            this.statusesStore.statuses.filter((s) => s.id !== id)
          );
        })
      )
    );
  }

  public updateStatus(
    id: string,
    statusData: { title: string; boardId: string }
  ): Promise<void> {
    return firstValueFrom(
      this.http
        .patch<void>(`${environment.apiUrl}/status/${id}`, statusData)
        .pipe(
          catchError(this.errorService.handleError),
          tap(() => {
            this.statusesStore.statuses$.next(
              this.statusesStore.statuses.map((s) =>
                s.id === id ? { ...s, title: statusData.title } : s
              )
            );
          })
        )
    );
  }
}
