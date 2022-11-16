import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BaseFormComponent } from '../abstract/base-form.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ITask } from '../models/task.model';
import { TasksService } from './tasks.service';
import { StatusesStore } from '../store/statuses.store';
import { IStatus } from '../models/status.model';
import { TasksStore } from '../store/tasks.store';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent extends BaseFormComponent implements OnInit {
  public editMode = false;
  public status!: IStatus;
  public allStatuses!: IStatus[];
  public task!: ITask;
  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public taskId: string,
    private taskService: TasksService,
    private statusesStore: StatusesStore,
    private tasksStore: TasksStore
  ) {
    super();
  }

  override ngOnInit(): void {
    this.allStatuses = this.statusesStore.statuses;

    this.tasksStore.tasks$
      .pipe(takeUntil(this.notifier$))
      .subscribe(
        (tasks) => (this.task = tasks.find((t) => t.id === this.taskId) as ITask)
      );

    this.status = {
      ...(this.allStatuses.find((s) => s.id === this.task.statusId) as IStatus),
    };

    super.ngOnInit();
  }

  public setForm(): void {
    this.componentForm = this.fb.group({
      title: [this.task.title, Validators.required],
      description: [this.task.description, Validators.required],
    });
  }

  public toggleMode(): void {
    this.editMode = !this.editMode;
  }

  public override async handleSubmit(): Promise<void> {
    this.toggleMode();

    return;
  }

  public async unassignTask(userId: string): Promise<void> {
    await this.taskService.unassignTask(userId, this.task.id);
  }

  public async changeStatus(): Promise<void> {
    await this.taskService.changeStatus(this.task.id, this.status.id);
  }
}
