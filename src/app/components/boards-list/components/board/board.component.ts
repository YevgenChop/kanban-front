import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ITask } from '../../../../models/task.model';
import { TaskComponent } from '../../../task/task.component';
import { IStatus } from '../../../../models/status.model';
import { TasksStore } from '../../../../store/tasks.store';
import { TasksService } from '../../../task/services/tasks.service';
import { StatusesStore } from '../../../../store/statuses.store';
import { UiComponent } from 'src/app/abstract/ui-component.component';
import { takeUntil } from 'rxjs';
import { IBoard } from 'src/app/models/board.model';
import { NewTaskComponent } from 'src/app/components/task/components/new-task/new-task.component';
import { BoardsService } from '../../services/boards.service';
import { NewStatusComponent } from 'src/app/components/boards-list/components/new-status/new-status.component';
import { EditBoardComponent } from 'src/app/components/boards-list/components/edit-board/edit-board.component';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent extends UiComponent implements OnInit {
  public mappedTasks!: { [key: string]: ITask[] };
  public statuses!: IStatus[];
  public board!: IBoard;
  public boardId = this.route.snapshot.params['boardId'];

  constructor(
    private tasksService: TasksService,
    private tasksStore: TasksStore,
    private statusesStore: StatusesStore,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private boardsService: BoardsService
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    this.subscribeToStatuses();
    this.subscribeToTasks();
    await this.getData();
  }

  private mapTasksToColumns(): void {
    const dictionary: { [key: string]: ITask[] } = {};

    for (const { title, id } of this.statuses) {
      if (!dictionary[title]) dictionary[title] = [];

      dictionary[title] = this.tasksStore.tasks.filter(
        (t) => t.statusId === id
      );
    }

    this.mappedTasks = dictionary;
  }

  private subscribeToStatuses(): void {
    this.statusesStore.statuses$
      .pipe(takeUntil(this.notifier$))
      .subscribe((statuses) => {
        this.statuses = statuses;
        this.mapTasksToColumns();
      });
  }

  private subscribeToTasks(): void {
    this.tasksStore.tasks$
      .pipe(takeUntil(this.notifier$))
      .subscribe(() => this.mapTasksToColumns());
  }

  private async getData(): Promise<void> {
    this.board = await this.boardsService.getBoardById(this.boardId);
    await this.tasksService.getTasksByBoardId(this.boardId);
    await this.tasksService.getTaskStatuses(this.boardId);
  }

  public preserveOrder(): number {
    return 0;
  }

  public openTaskDialog(taskId: string): void {
    this.dialog.open(TaskComponent, { data: taskId });
  }

  public openNewTaskDialog(): void {
    this.dialog.open(NewTaskComponent, { data: this.boardId });
  }

  public openNewStatusDialog(): void {
    this.dialog.open(NewStatusComponent, { data: this.boardId });
  }

  public openEditBoardDialog(): void {
    this.dialog
      .open(EditBoardComponent, { data: this.board })
      .afterClosed()
      .subscribe(
        async ({ updated }) =>
          updated &&
          (this.board = await this.boardsService.getBoardById(this.boardId))
      );
  }
}
