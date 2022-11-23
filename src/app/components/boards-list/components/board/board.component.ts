import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ITask } from '../../../../models/task.model';
import { TaskComponent } from '../../../task/task.component';
import { IStatus } from '../../../../models/status.model';
import { TasksStore } from '../../../../store/tasks.store';
import { TasksService } from '../../../task/services/tasks.service';
import { StatusesStore } from '../../../../store/statuses.store';
import { UiComponent } from '../../../../abstract/ui-component.component';
import { Observable, of, takeUntil } from 'rxjs';
import { IBoard } from '../../../../models/board.model';
import { BoardsService } from '../../services/boards.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ColumnsService } from './services/columns.service';
import { DragAndDropService } from './services/drag-and-drop.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent extends UiComponent implements OnInit {
  private statuses!: IStatus[];
  public mappedTasks!: { [key: string]: ITask[] };
  public board!: IBoard;
  public columns!: string[];
  public boardId = this.route.snapshot.params['boardId'];

  public getColumns(): string[]{
    return this.columns;
  }

  constructor(
    private tasksService: TasksService,
    private tasksStore: TasksStore,
    private statusesStore: StatusesStore,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private boardsService: BoardsService,
    private snackBar: MatSnackBar,
    private columnsService: ColumnsService,
    private dragAndDropService: DragAndDropService
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    await this.getData();
    this.subscribeToStatuses();
    this.subscribeToTasks();
  }

  private async getData(): Promise<void> {
    this.getBoard();
    await this.tasksService.getTasksByBoardId(this.boardId);
    await this.tasksService.getTaskStatuses(this.boardId);
  }

  public async getBoard(): Promise<void> {
    this.board = await this.boardsService.getBoardById(this.boardId);
  }

  private subscribeToStatuses(): void {
    this.statusesStore.statuses$
      .pipe(takeUntil(this.notifier$))
      .subscribe((statuses) => {
        this.statuses = statuses;
        this.columns = this.columnsService.getColumns(
          this.boardId,
          this.statuses.map(({ title }) => title)
        );
      });
  }

  private subscribeToTasks(): void {
    this.tasksStore.tasks$.pipe(takeUntil(this.notifier$)).subscribe(() => {
      this.mappedTasks = this.columnsService.mapTasksToColumns(
        this.statuses,
        this.tasksStore.tasks
      );
    });
  }

  public async dropTask(
    event: CdkDragDrop<{ tasks: ITask[]; statusTitle: string }>
  ): Promise<void> {
    this.dragAndDropService.dropTask(event);
    try {
      await this.changeTaskStatus(event);
    } catch (error) {
      this.handleStatusChangeError(event);
    }
  }

  public dropColumn(event: CdkDragDrop<string[]>): void {
    this.dragAndDropService.dropColumn(event);
    this.columnsService.saveColumnsOrder(this.boardId, this.columns);
  }

  public openTaskDialog(taskId: string): void {
    this.dialog.open(TaskComponent, { data: taskId });
  }

  private async changeTaskStatus(
    event: CdkDragDrop<{ tasks: ITask[]; statusTitle: string }>
  ) {
    const statusId = this.statuses.find(
      (s) => s.title === event.container.data.statusTitle
    )?.id as string;
    const taskId = event.container.data.tasks[event.currentIndex].id;

    await this.tasksService.changeStatus(taskId, statusId);
  }

  private handleStatusChangeError(
    event: CdkDragDrop<{ tasks: ITask[]; statusTitle: string }>
  ) {
    this.dragAndDropService.putTaskBack(event);

    this.snackBar.open('Something went wrong...', undefined, {
      duration: 3000,
    });
  }
}
