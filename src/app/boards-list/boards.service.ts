import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { IBoard } from '../models/board.model';
import { AuthUserStore } from '../store/auth-user.store';
import { BoardsStore } from '../store/boards.store';

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
        .pipe(tap((boards) => this.boardsStore.boards$.next(boards)))
    );
  }

  public deleteBoard(id: string): Promise<void> {
    return firstValueFrom(
      this.http
        .delete<void>(`${environment.apiUrl}/board/${id}`)
        .pipe(
          tap(() =>
            this.boardsStore.boards$.next(
              this.boardsStore.boards.filter((b) => b.id !== id)
            )
          )
        )
    );
  }
}
