import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, firstValueFrom, tap } from 'rxjs';
import { TasksStore } from '../../../../../store/tasks.store';
import { ITask, ITaskComment } from '../../../../../models/task.model';
import { environment } from '../../../../../../environments/environment';
import { ErrorHandlingService } from '../../../../../shared/services/error-handling.service';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  constructor(
    private http: HttpClient,
    private tasksStore: TasksStore,
    private errorService: ErrorHandlingService
  ) {}

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
        .pipe(catchError(this.errorService.handleError))
    );
  }

  public async deleteComment(commentId: string, taskId: string): Promise<void> {
    await firstValueFrom(
      this.http.delete<void>(`${environment.apiUrl}/comment/${commentId}`).pipe(
        tap(() => this.handleDelete(taskId, commentId)),
        catchError(this.errorService.handleError)
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
          tap(() => this.handleUpdate(taskId, commentId, commentText)),
          catchError(this.errorService.handleError)
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
          catchError(this.errorService.handleError)
        )
    );
  }

  private handleDelete(taskId: string, commentId: string): void {
    this.tasksStore.tasks$.next(
      this.tasksStore.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              comments: t.comments.filter((c) => c.id !== commentId),
            }
          : t
      )
    );
  }

  private handleUpdate(
    taskId: string,
    commentId: string,
    commentText: string
  ): void {
    const { comments } = this.tasksStore.tasks.find(
      (t) => t.id === taskId
    ) as ITask;
    const comment = comments.find((c) => c.id === commentId) as ITaskComment;

    comment.commentText = commentText;

    this.tasksStore.tasks$.next(this.tasksStore.tasks);
  }
}
