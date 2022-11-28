import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, firstValueFrom, tap } from 'rxjs';
import { ErrorHandlingService } from '../../../shared/services/error-handling.service';
import { environment } from '../../../../environments/environment';
import {
  IBoard,
  IBoardWithUsers,
  INewBoardData,
} from '../../../models/board.model';
import { AuthUserStore } from '../../../store/auth-user.store';
import { BoardsStore } from '../../../store/boards.store';

@Injectable({
  providedIn: 'root',
})
export class BoardsService {
  constructor(
    private http: HttpClient,
    private authUserStore: AuthUserStore,
    private boardsStore: BoardsStore,
    private errorService: ErrorHandlingService
  ) {}

  public getBoardsByOwnerId(limit = 100, offset = 0): Promise<IBoardWithUsers[]> {
    const id = this.authUserStore.id;
    return firstValueFrom(
      this.http
        .get<IBoardWithUsers[]>(
          `${environment.apiUrl}/board?ownerId=${id}&limit=${limit}&offset=${offset}`
        )
        .pipe(
          catchError(this.errorService.handleError),
          tap((boards) => this.boardsStore.boards$.next(boards))
        )
    );
  }

  public getBoardsByUserId(limit = 100, offset = 0): Promise<IBoardWithUsers[]> {
    const id = this.authUserStore.id;
    return firstValueFrom(
      this.http
        .get<IBoardWithUsers[]>(
          `${environment.apiUrl}/board?userId=${id}&limit=${limit}&offset=${offset}`
        )
        .pipe(
          catchError(this.errorService.handleError),
          tap((boards) => this.boardsStore.boards$.next(boards))
        )
    );
  }

  public deleteBoard(id: string): Promise<void> {
    return firstValueFrom(
      this.http.delete<void>(`${environment.apiUrl}/board/${id}`).pipe(
        catchError(this.errorService.handleError),
        tap(() =>
          this.boardsStore.boards$.next(
            this.boardsStore.boards.filter((b) => b.id !== id)
          )
        )
      )
    );
  }

  public createBoard(boardData: INewBoardData): Promise<IBoardWithUsers> {
    return firstValueFrom(
      this.http
        .post<IBoardWithUsers>(`${environment.apiUrl}/board`, { ...boardData })
        .pipe(
          catchError(this.errorService.handleError),
          tap((board) =>
            this.boardsStore.boards$.next([board, ...this.boardsStore.boards])
          )
        )
    );
  }

  public updateBoard(
    boardId: string,
    { title, description, usersIds }: INewBoardData
  ): Promise<IBoard> {
    return firstValueFrom(
      this.http
        .patch<IBoard>(`${environment.apiUrl}/board/${boardId}`, {
          title,
          description,
          usersIds,
        })
        .pipe(
          catchError(this.errorService.handleError),
          tap(() => {
            this.boardsStore.boards$.next(
              this.boardsStore.boards.map((b) =>
                b.id === boardId ? { ...b, title, description } : b
              )
            );
          })
        )
    );
  }

  public getBoardById(id: string): Promise<IBoardWithUsers> {
    return firstValueFrom(
      this.http
        .get<IBoardWithUsers>(`${environment.apiUrl}/board/${id}`)
        .pipe(catchError(this.errorService.handleError))
    );
  }
}
