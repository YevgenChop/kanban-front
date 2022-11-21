import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IUserSearchResult } from '../../../../models/user-search-result.model';
import { BaseFormComponent } from '../../../../abstract/base-form.component';
import { StatusesStore } from '../../../../store/statuses.store';
import { TasksService } from '../../services/tasks.service';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss'],
})
export class NewTaskComponent extends BaseFormComponent {
  public statuses = this.statusesStore.statuses;
  public selectedUsers: IUserSearchResult[] = [];
  public get selectedUsersIds(): string[] {
    return this.selectedUsers.map(({ id }) => id);
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public boardId: string,
    private fb: FormBuilder,
    private tasksService: TasksService,
    private statusesStore: StatusesStore,
    private dialogRef: MatDialogRef<NewTaskComponent>
  ) {
    super();
  }

  public setForm(): void {
    this.componentForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(200)]],
      statusId: [
        this.statuses[0].id,
        [Validators.required, Validators.maxLength(200)],
      ],
    });
  }

  public handleUserSelect(user: IUserSearchResult): void {
    this.selectedUsers.push(user);
  }

  public override async handleSubmit(): Promise<void> {
    await super.handleSubmit(async () => {
      await this.tasksService.createTask({
        ...this.componentForm.getRawValue(),
        boardId: this.boardId,
        usersIds: this.selectedUsers.map(({ id }) => id),
      });
      this.dialogRef.close();
    });
  }

  public unselectUser(userId: string): void {
    this.selectedUsers = this.selectedUsers.filter((u) => u.id !== userId);
  }
}
