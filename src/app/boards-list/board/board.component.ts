import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ITask } from '../../models/task.model';
import { TaskComponent } from '../../task/task.component';
import { IStatus } from '../../models/status.model';
import { TasksStore } from '../../store/tasks.store';
import { TasksService } from '../../task/tasks.service';
import { StatusesStore } from '../../store/statuses.store';
import { UiComponent } from 'src/app/abstract/ui-component.component';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent extends UiComponent implements OnInit {
  public tasksDictionary!: { [key: string]: ITask[] };
  public statuses!: IStatus[];

  constructor(
    private tasksService: TasksService,
    private tasksStore: TasksStore,
    private statusesStore: StatusesStore,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    await this.tasksService.getTasksByBoardId(
      this.route.snapshot.params['boardId']
    );

    await this.tasksService.getTaskStatuses();
    this.statuses = this.statusesStore.statuses;

    this.tasksStore.tasks$
      .pipe(takeUntil(this.notifier$))
      .subscribe(() => (this.tasksDictionary = this.createDictionary()));
  }

  private createDictionary(): { [key: string]: ITask[] } {
    const dictionary: { [key: string]: ITask[] } = {};

    for (const { title, id } of this.statuses) {
      if (!dictionary[title]) {
        dictionary[title] = [];
      }

      dictionary[title] = this.tasksStore.tasks.filter(
        (t) => t.statusId === id
      );
    }

    return dictionary;
  }

  public preserveOrder(): number {
    return 0;
  }

  public openDialog(task: ITask): void {
    this.dialog.open(TaskComponent, { data: task.id });
  }
}
