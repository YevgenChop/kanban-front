import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseFormComponent } from '../../../../abstract/base-form.component';
import { BoardsService } from '../../services/boards.service';
import { IBoardWithUsers } from '../../../../models/board.model';
import { IUserSearchResult } from '../../../../models/user-search-result.model';

@Component({
  selector: 'app-edit-board',
  templateUrl: './edit-board.component.html',
  styleUrls: ['./edit-board.component.scss'],
})
export class EditBoardComponent extends BaseFormComponent {
  public selectedUsers = this.board.users;
  public get selectedUsersIds(): string[] {
    return this.selectedUsers.map(({ id }) => id);
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) private board: IBoardWithUsers,
    private fb: FormBuilder,
    private boardsService: BoardsService,
    private dialogRef: MatDialogRef<EditBoardComponent>
  ) {
    super();
  }

  public setForm(): void {
    this.componentForm = this.fb.group(
      {
        title: [this.board.title, Validators.required],
        description: [this.board.description, Validators.required],
      },
      { updateOn: 'change' }
    );
  }

  public override async handleSubmit(): Promise<void> {
    await super.handleSubmit(async () => {
      await this.boardsService.updateBoard(this.board.id, {
        ...this.componentForm.getRawValue(),
        usersIds: this.selectedUsersIds,
      });
      this.dialogRef.close(true);
    });
  }

  public handleUserSelect(user: IUserSearchResult): void {
    this.selectedUsers.push(user);
  }

  public unselectUser(userId: string): void {
    this.selectedUsers = this.selectedUsers.filter((u) => u.id !== userId);
  }
}
