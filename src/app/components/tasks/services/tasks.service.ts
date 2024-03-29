import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, firstValueFrom, tap } from 'rxjs';
import { TasksStore } from '../../../store/tasks.store';
import {
  ICreateTaskData,
  ITask,
  IUpdateTaskData,
} from '../../../models/task.model';
import { environment } from '../../../../environments/environment';
import { IStatus } from '../../../models/status.model';
import { StatusesStore } from '../../../store/statuses.store';
import { IUserSearchResult } from '../../../models/user-search-result.model';
import { ErrorHandlingService } from '../../../shared/services/error-handling.service';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  constructor(
    private http: HttpClient,
    private tasksStore: TasksStore,
    private statusesStore: StatusesStore,
    private errorService: ErrorHandlingService
  ) {}

  public getTasksByBoardId(boardId: string): Promise<ITask[]> {
    return firstValueFrom(
      this.http
        .get<ITask[]>(`${environment.apiUrl}/task?boardId=${boardId}`)
        .pipe(
          catchError(this.errorService.handleError),
          tap((tasks) => this.tasksStore.tasks$.next(tasks))
        )
    );
  }

  public createTask(taskData: ICreateTaskData): Promise<ITask> {
    return firstValueFrom(
      this.http.post<ITask>(`${environment.apiUrl}/task`, { ...taskData }).pipe(
        catchError(this.errorService.handleError),
        tap((task) =>
          this.tasksStore.tasks$.next([task, ...this.tasksStore.tasks])
        )
      )
    );
  }

  public updateTask(
    taskId: string,
    { title, description }: IUpdateTaskData
  ): Promise<void> {
    return firstValueFrom(
      this.http
        .patch<void>(`${environment.apiUrl}/task/${taskId}`, {
          title,
          description,
        })
        .pipe(
          catchError(this.errorService.handleError),
          tap(() =>
            this.tasksStore.tasks$.next(
              this.tasksStore.tasks.map((t) =>
                t.id === taskId
                  ? {
                      ...t,
                      title,
                      description,
                    }
                  : t
              )
            )
          )
        )
    );
  }

  public getTaskStatuses(boardId: string): Promise<IStatus[]> {
    return firstValueFrom(
      this.http
        .get<IStatus[]>(`${environment.apiUrl}/status?boardId=${boardId}`)
        .pipe(
          catchError(this.errorService.handleError),
          tap((statuses) => this.statusesStore.statuses$.next(statuses))
        )
    );
  }

  public async unassignTask(userId: string, taskId: string): Promise<void> {
    await firstValueFrom(
      this.http
        .post<void>(`${environment.apiUrl}/task/unassign/${taskId}`, {
          userId,
        })
        .pipe(
          catchError(this.errorService.handleError),
          tap(() =>
            this.tasksStore.tasks$.next(
              this.tasksStore.tasks.map((t) =>
                t.id === taskId
                  ? { ...t, users: t.users.filter((u) => u.id !== userId) }
                  : t
              )
            )
          )
        )
    );
  }

  public async assignTask(
    user: IUserSearchResult,
    taskId: string
  ): Promise<void> {
    await firstValueFrom(
      this.http
        .post<void>(`${environment.apiUrl}/task/assign/${taskId}`, {
          userId: user.id,
        })
        .pipe(
          catchError(this.errorService.handleError),
          tap(() =>
            this.tasksStore.tasks$.next(
              this.tasksStore.tasks.map((t) =>
                t.id === taskId ? { ...t, users: [...t.users, user] } : t
              )
            )
          )
        )
    );
  }

  public async changeStatus(taskId: string, statusId: string): Promise<void> {
    await firstValueFrom(
      this.http
        .patch<void>(`${environment.apiUrl}/task/${taskId}`, {
          statusId,
        })
        .pipe(
          catchError(this.errorService.handleError),
          tap(() =>
            this.tasksStore.tasks$.next(
              this.tasksStore.tasks.map((t) =>
                t.id === taskId ? { ...t, statusId } : t
              )
            )
          )
        )
    );
  }

  public async deleteTask(taskId: string): Promise<void> {
    await firstValueFrom(
      this.http.delete<void>(`${environment.apiUrl}/task/${taskId}`).pipe(
        catchError(this.errorService.handleError),
        tap(() =>
          this.tasksStore.tasks$.next(
            this.tasksStore.tasks.filter((t) => t.id !== taskId)
          )
        )
      )
    );
  }
}
