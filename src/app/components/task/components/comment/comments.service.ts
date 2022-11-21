import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, firstValueFrom, tap } from 'rxjs';
import { TasksStore } from '../../../../store/tasks.store';
import {
  ICreateTaskData,
  ITask,
  ITaskComment,
  IUpdateTaskData,
} from '../../../../models/task.model';
import { environment } from '../../../../../environments/environment';
import { IStatus } from '../../../../models/status.model';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  constructor(private http: HttpClient, private tasksStore: TasksStore) {}

  public async leaveComment(
    taskId: string,
    commentText: string
  ): Promise<void> {
    await firstValueFrom(
      this.http
        .post<void>(`${environment.apiUrl}/comment`, {
          taskId,
          commentText,
        })
        .pipe(catchError(this.handleError))
    );
  }

  public async deleteComment(commentId: string, taskId: string): Promise<void> {
    await firstValueFrom(
      this.http.delete<void>(`${environment.apiUrl}/comment/${commentId}`).pipe(
        tap(() =>
          this.tasksStore.tasks$.next(
            this.tasksStore.tasks.map((t) =>
              t.id === taskId
                ? {
                    ...t,
                    comments: t.comments.filter((c) => c.id !== commentId),
                  }
                : t
            )
          )
        ),
        catchError(this.handleError)
      )
    );
  }

  public async updateComment(
    commentId: string,
    commentText: string,
    taskId: string
  ): Promise<void> {
    await firstValueFrom(
      this.http
        .patch<void>(`${environment.apiUrl}/comment/${commentId}`, {
          commentText,
        })
        .pipe(
          tap(() =>
            this.tasksStore.tasks$.next(
              this.tasksStore.tasks.map((t) =>
                t.id === taskId
                  ? {
                      ...t,
                      comments: t.comments.map((c) =>
                        c.id === commentId ? { ...c, commentText } : c
                      ),
                    }
                  : t
              )
            )
          ),
          catchError(this.handleError)
        )
    );
  }

  public async getCommentsByTaskId(taskId: string): Promise<void> {
    await firstValueFrom(
      this.http
        .get<ITaskComment[]>(`${environment.apiUrl}/comment?taskId=${taskId}`)
        .pipe(
          tap((comments) =>
            this.tasksStore.tasks$.next(
              this.tasksStore.tasks.map((t) =>
                t.id === taskId ? { ...t, comments } : t
              )
            )
          ),
          catchError(this.handleError)
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
