import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs';
import { UiComponent } from 'src/app/abstract/ui-component.component';
import { NewTaskComponent } from 'src/app/components/task/components/new-task/new-task.component';
import { TaskComponent } from 'src/app/components/task/task.component';
import { IBoard } from 'src/app/models/board.model';
import { EditBoardComponent } from '../../../edit-board/edit-board.component';
import { NewStatusComponent } from '../../../new-status/new-status.component';

@Component({
  selector: 'app-board-header',
  templateUrl: './board-header.component.html',
  styleUrls: ['./board-header.component.scss'],
})
export class BoardHeaderComponent extends UiComponent {
  @Input() board!: IBoard;
  @Output() updateBoardEvent = new EventEmitter<void>();

  constructor(private dialog: MatDialog) {
    super();
  }

  public openTaskDialog(taskId: string): void {
    this.dialog.open(TaskComponent, { data: taskId });
  }

  public openNewTaskDialog(): void {
    this.dialog.open(NewTaskComponent, { data: this.board.id });
  }

  public openNewStatusDialog(): void {
    this.dialog.open(NewStatusComponent, { data: this.board.id });
  }

  public openEditBoardDialog(): void {
    this.dialog
      .open(EditBoardComponent, { data: this.board })
      .afterClosed()
      .pipe(takeUntil(this.notifier$))
      .subscribe(async ({ updated }) => updated && this.updateBoardEvent.emit());
  }
}
