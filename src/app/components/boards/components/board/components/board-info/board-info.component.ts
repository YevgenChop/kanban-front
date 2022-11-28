import { Component, Input } from '@angular/core';
import { IBoardWithUsers } from '../../../../../../models/board.model';

@Component({
  selector: 'app-board-info',
  templateUrl: './board-info.component.html',
  styleUrls: ['./board-info.component.scss'],
})
export class BoardInfoComponent {
  @Input() board!: IBoardWithUsers;
  @Input() numberOfTasks!: number;
  @Input() numberOfDoneTasks!: number;
  @Input() numberOfBlockedTasks!: number;

  public get boardUsersString(): string {
    return this.board.users.map((u) => u.name).join(', ');
  }
}
