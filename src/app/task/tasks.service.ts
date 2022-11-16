import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, tap } from 'rxjs';
import { TasksStore } from '../store/tasks.store';
import { ITask } from '../models/task.model';
import { environment } from '../../environments/environment';
import { IStatus } from '../models/status.model';
import { StatusesStore } from '../store/statuses.store';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  constructor(
    private http: HttpClient,
    private tasksStore: TasksStore,
    private statusesStore: StatusesStore
  ) {}

  public getTasksByBoardId(boardId: string): Promise<ITask[]> {
    return firstValueFrom(
      this.http
        .get<ITask[]>(`${environment.apiUrl}/task?boardId=${boardId}`)
        .pipe(tap((tasks) => this.tasksStore.tasks$.next(tasks)))
    );
  }

  public getTaskStatuses(): Promise<IStatus[]> {
    return firstValueFrom(
      this.http.get<IStatus[]>(`${environment.apiUrl}/status`).pipe(
        tap((statuses) => {
          console.log({ statuses });

          this.statusesStore.statuses$.next(statuses);
        })
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
    user: { id: string; email: string; name: string },
    taskId: string
  ): Promise<void> {
    await firstValueFrom(
      this.http
        .post<void>(`${environment.apiUrl}/task/assign/${taskId}`, {
          userId: user.id,
        })
        .pipe(
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

  public async leaveComment(
    taskId: string,
    commentText: string
  ): Promise<void> {
    await firstValueFrom(
      this.http.post<void>(`${environment.apiUrl}/comment`, {
        taskId,
        commentText,
      })
    );
  }

  public async changeStatus(taskId: string, statusId: string): Promise<void> {
    await firstValueFrom(
      this.http
        .patch<void>(`${environment.apiUrl}/task/${taskId}`, {
          statusId,
        })
        .pipe(
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
}
