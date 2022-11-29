import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { BoardsStore } from '../../store/boards.store';
import { BoardsService } from './services/boards.service';
import { AuthUserStore } from '../../store/auth-user.store';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { firstValueFrom } from 'rxjs';
import { IBoardWithUsers } from '../../models/board.model';
import { SnackbarService } from '../../shared/services/snackbar.service';

@Component({
  selector: 'app-boards-list',
  templateUrl: './boards-list.component.html',
  styleUrls: ['./boards-list.component.scss'],
})
export class BoardsListComponent implements OnInit {
  public boards$ = this.boardsStore.boards$;
  public authUserId = this.authUserStore.authUser?.id;
  constructor(
    private boardsService: BoardsService,
    private boardsStore: BoardsStore,
    private location: Location,
    private authUserStore: AuthUserStore,
    private matDialog: MatDialog,
    private snackbarService: SnackbarService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      await this.getBoards();
    } catch (error) {
      this.snackbarService.open(error as string);
    }
  }

  public async deleteBoard(board: IBoardWithUsers): Promise<void> {
    const shouldDelete = await firstValueFrom(
      this.matDialog.open(ConfirmDialogComponent).afterClosed()
    );

    if (!shouldDelete) return;

    await this.boardsService.deleteBoard(board.id);
  }

  private async getBoards(): Promise<void> {
    if (this.location.path() === '/my-boards') {
      await this.boardsService.getBoardsByOwnerId();
      return;
    }

    await this.boardsService.getBoardsByUserId();
  }
}
