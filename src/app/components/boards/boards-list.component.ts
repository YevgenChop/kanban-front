import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { BoardsStore } from '../../store/boards.store';
import { BoardsService } from './services/boards.service';
import { AuthUserStore } from '../../store/auth-user.store';

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
    private authUserStore: AuthUserStore
  ) {}

  async ngOnInit(): Promise<void> {
    if (this.location.path() === '/my-boards') {
      await this.boardsService.getBoardsByOwnerId();
      return;
    }

    await this.boardsService.getBoardsByUserId();
  }

  public async deleteBoard(id: string): Promise<void> {
    if (confirm('Are you sure you want to delete this board')) {
      await this.boardsService.deleteBoard(id);
    }
  }
}
