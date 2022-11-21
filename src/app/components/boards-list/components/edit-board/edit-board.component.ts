import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseFormComponent } from '../../../../abstract/base-form.component';
import { BoardsService } from '../../services/boards.service';
import { IBoard, IBoardWithUsers } from '../../../../models/board.model';

@Component({
  selector: 'app-edit-board',
  templateUrl: './edit-board.component.html',
  styleUrls: ['./edit-board.component.scss'],
})
export class EditBoardComponent extends BaseFormComponent {
  public selectedUsers = this.board.users;
  constructor(
    @Inject(MAT_DIALOG_DATA) private board: IBoardWithUsers,
    private fb: FormBuilder,
    private boardsService: BoardsService,
    private dialogRef: MatDialogRef<EditBoardComponent>
  ) {
    super();
  }

  public setForm(): void {
    this.componentForm = this.fb.group({
      title: [this.board.title, Validators.required],
      description: [this.board.description, Validators.required],
    });
  }

  public override async handleSubmit(): Promise<void> {
    await super.handleSubmit(async () => {
      await this.boardsService.updateBoard(this.board.id, {
        ...this.componentForm.getRawValue(),
        usersIds: this.selectedUsers.map(({ id }) => id),
      });
      this.dialogRef.close({ updated: true });
    });
  }

  public handleUserSelect(user: {
    id: string;
    name: string;
    email: string;
  }): void {
    this.selectedUsers.push(user);
  }

  public unselectUser(userId: string): void {
    this.selectedUsers = this.selectedUsers.filter((u) => u.id !== userId);
  }
}
