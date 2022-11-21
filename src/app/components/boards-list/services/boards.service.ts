import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, firstValueFrom, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { IBoard, INewBoardData } from '../../../models/board.model';
import { AuthUserStore } from '../../../store/auth-user.store';
import { BoardsStore } from '../../../store/boards.store';

@Injectable({
  providedIn: 'root',
})
export class BoardsService {
  constructor(
    private http: HttpClient,
    private authUserStore: AuthUserStore,
    private boardsStore: BoardsStore
  ) {}

  public getBoardsByOwnerId(limit = 5, offset = 0): Promise<IBoard[]> {
    const id = this.authUserStore.id;
    return firstValueFrom(
      this.http
        .get<IBoard[]>(
          `${environment.apiUrl}/board?ownerId=${id}&limit=${limit}&offset=${offset}`
        )
        .pipe(
          catchError(this.handleError),
          tap((boards) => this.boardsStore.boards$.next(boards))
        )
    );
  }

  public getBoardsByUserId(limit = 5, offset = 0): Promise<IBoard[]> {
    const id = this.authUserStore.id;
    return firstValueFrom(
      this.http
        .get<IBoard[]>(
          `${environment.apiUrl}/board?userId=${id}&limit=${limit}&offset=${offset}`
        )
        .pipe(
          catchError(this.handleError),
          tap((boards) => this.boardsStore.boards$.next(boards))
        )
    );
  }

  public deleteBoard(id: string): Promise<void> {
    return firstValueFrom(
      this.http.delete<void>(`${environment.apiUrl}/board/${id}`).pipe(
        catchError(this.handleError),
        tap(() =>
          this.boardsStore.boards$.next(
            this.boardsStore.boards.filter((b) => b.id !== id)
          )
        )
      )
    );
  }

  public createBoard(boardData: INewBoardData): Promise<IBoard> {
    return firstValueFrom(
      this.http
        .post<IBoard>(`${environment.apiUrl}/board`, { ...boardData })
        .pipe(
          catchError(this.handleError),
          tap((board) =>
            this.boardsStore.boards$.next([board, ...this.boardsStore.boards])
          )
        )
    );
  }

  public updateBoard(
    boardId: string,
    boardData: INewBoardData
  ): Promise<IBoard> {
    return firstValueFrom(
      this.http
        .patch<IBoard>(`${environment.apiUrl}/board/${boardId}`, {
          ...boardData,
        })
        .pipe(
          catchError(this.handleError),
          tap(() => {
            this.boardsStore.boards$.next(
              this.boardsStore.boards.map((b) =>
                b.id === boardId
                  ? {
                      ...b,
                      title: boardData.title,
                      description: boardData.description,
                    }
                  : b
              )
            );
          })
        )
    );
  }

  public getBoardById(id: string): Promise<IBoard> {
    return firstValueFrom(
      this.http
        .get<IBoard>(`${environment.apiUrl}/board/${id}`)
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