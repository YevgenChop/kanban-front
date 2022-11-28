import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { NewTaskComponent } from '../../../../../../components/tasks/components/new-task/new-task.component';
import { TaskComponent } from '../../../../../../components/tasks/task.component';
import { IBoardWithUsers } from '../../../../../../models/board.model';
import { EditBoardComponent } from '../../../edit-board/edit-board.component';
import { StatusDialogComponent } from '../../../../../statuses/status-dialog.component';

@Component({
  selector: 'app-board-header',
  templateUrl: './board-header.component.html',
  styleUrls: ['./board-header.component.scss'],
})
export class BoardHeaderComponent {
  @Input() board!: IBoardWithUsers;
  @Input() columns!: string[];
  @Input() getColumns!: () => string[];
  @Output() updateBoardEvent = new EventEmitter<void>();

  constructor(private dialog: MatDialog) {}

  public openTaskDialog(taskId: string): void {
    this.dialog.open(TaskComponent, { maxWidth: '100vw', data: taskId });
  }

  public openNewTaskDialog(): void {
    this.dialog.open(NewTaskComponent, {
      maxWidth: '100vw',
      data: this.board.id,
    });
  }

  public openStatusesDialog(): void {
    this.dialog.open(StatusDialogComponent, {
      maxWidth: '100vw',
      data: {
        boardId: this.board.id,
        getColumns: this.getColumns,
      },
      autoFocus: false,
    });
  }

  public async openEditBoardDialog(): Promise<void> {
    const shouldUpdate = await firstValueFrom(
      this.dialog
        .open(EditBoardComponent, { maxWidth: '100vw', data: this.board })
        .afterClosed()
    );

    if (!shouldUpdate) return;

    this.updateBoardEvent.emit();
  }
}
