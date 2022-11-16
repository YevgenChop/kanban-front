import { Component, OnInit } from '@angular/core';
import { BoardsStore } from '../store/boards.store';
import { BoardsService } from './boards.service';

@Component({
  selector: 'app-boards-list',
  templateUrl: './boards-list.component.html',
  styleUrls: ['./boards-list.component.scss'],
})
export class BoardsListComponent implements OnInit {
  public boards$ = this.boardsStore.boards$;
  constructor(
    private boardsService: BoardsService,
    private boardsStore: BoardsStore
  ) {}

  async ngOnInit(): Promise<void> {
    await this.boardsService.getBoardsByOwnerId();
  }

  public async deleteBoard(id: string): Promise<void> {
    if (confirm('Are you sure you want to delete this board')) {
      await this.boardsService.deleteBoard(id);
    }
  }
}
