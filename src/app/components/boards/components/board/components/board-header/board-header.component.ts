import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs';
import { UiComponent } from '../../../../../../abstract/ui-component.component';
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
export class BoardHeaderComponent extends UiComponent {
  @Input() board!: IBoardWithUsers;
  @Input() columns!: string[];
  @Input() getColumns!: () => string[];
  @Output() updateBoardEvent = new EventEmitter<void>();

  constructor(private dialog: MatDialog) {
    super();
  }

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

  public openEditBoardDialog(): void {
    this.dialog
      .open(EditBoardComponent, { maxWidth: '100vw', data: this.board })
      .afterClosed()
      .pipe(takeUntil(this.notifier$))
      .subscribe(
        async ({ updated }) => updated && this.updateBoardEvent.emit()
      );
  }
}
