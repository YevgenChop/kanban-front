import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BaseFormComponent } from '../../abstract/base-form.component';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ITask } from '../../models/task.model';
import { TasksService } from './services/tasks.service';
import { StatusesStore } from '../../store/statuses.store';
import { IStatus } from '../../models/status.model';
import { TasksStore } from '../../store/tasks.store';
import { firstValueFrom, takeUntil } from 'rxjs';
import { IUserSearchResult } from '../../models/user-search-result.model';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { SnackbarService } from '../../shared/services/snackbar.service';

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
  public get taskUsersIds(): string[] {
    return this.task.users.map(({ id }) => id);
  }

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public taskId: string,
    private taskService: TasksService,
    private statusesStore: StatusesStore,
    private tasksStore: TasksStore,
    private dialogRef: MatDialogRef<TaskComponent>,
    private matDialog: MatDialog,
    private snackbarService: SnackbarService
  ) {
    super();
  }

  override ngOnInit(): void {
    this.allStatuses = this.statusesStore.statuses;

    this.tasksStore.tasks$
      .pipe(takeUntil(this.notifier$))
      .subscribe(
        (tasks) =>
          (this.task = tasks.find((t) => t.id === this.taskId) as ITask)
      );

    this.status = {
      ...(this.allStatuses.find((s) => s.id === this.task.statusId) as IStatus),
    };

    super.ngOnInit();
  }

  public setForm(): void {
    this.componentForm = this.fb.group(
      {
        title: [this.task.title, Validators.required],
        description: [this.task.description, Validators.required],
      },
      { updateOn: 'change' }
    );
  }

  public toggleMode(): void {
    this.editMode = !this.editMode;
    this.setForm();
  }

  public override async handleSubmit(): Promise<void> {
    await super.handleSubmit(
      async () => {
        await this.taskService.updateTask(
          this.task.id,
          this.componentForm.getRawValue()
        );
        this.toggleMode();
      },
      { reset: false }
    );
  }

  public async unassignTask(userId: string): Promise<void> {
    try {
      await this.taskService.unassignTask(userId, this.task.id);
    } catch (error) {
      this.handleError(error as string);
    }
  }

  public async assignTask(user: IUserSearchResult): Promise<void> {
    try {
      await this.taskService.assignTask(user, this.task.id);
    } catch (error) {
      this.handleError(error as string);
    }
  }

  public async changeStatus(): Promise<void> {
    try {
      await this.taskService.changeStatus(this.task.id, this.status.id);
    } catch (error) {
      this.handleError(error as string);
    }
  }

  public async deleteTask(): Promise<void> {
    const shouldDelete = await firstValueFrom(
      this.matDialog.open(ConfirmDialogComponent).afterClosed()
    );

    if (!shouldDelete) return;

    try {
      await this.taskService.deleteTask(this.task.id);
      this.dialogRef.close();
    } catch (error) {
      this.handleError(error as string);
    }
  }

  private handleError(error: string): void {
    this.snackbarService.open(error);
  }
}
