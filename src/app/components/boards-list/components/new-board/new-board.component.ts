import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseFormComponent } from '../../../../abstract/base-form.component';
import { BoardsService } from '../../services/boards.service';

@Component({
  selector: 'app-new-board',
  templateUrl: './new-board.component.html',
  styleUrls: ['./new-board.component.scss'],
})
export class NewBoardComponent extends BaseFormComponent {
  public selectedUsers: { id: string; name: string; email: string }[] = [];
  constructor(
    private fb: FormBuilder,
    private boardsService: BoardsService,
    private router: Router
  ) {
    super();
  }

  public setForm(): void {
    this.componentForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  public override async handleSubmit(): Promise<void> {
    await super.handleSubmit(async () => {
      const { id } = await this.boardsService.createBoard({
        ...this.componentForm.getRawValue(),
        usersIds: this.selectedUsers.map(({ id }) => id),
      });
      this.router.navigateByUrl(`boards/${id}`);
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
