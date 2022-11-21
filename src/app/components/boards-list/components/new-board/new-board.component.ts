import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IUserSearchResult } from '../../../../models/user-search-result.model';
import { BaseFormComponent } from '../../../../abstract/base-form.component';
import { BoardsService } from '../../services/boards.service';

@Component({
  selector: 'app-new-board',
  templateUrl: './new-board.component.html',
  styleUrls: ['./new-board.component.scss'],
})
export class NewBoardComponent extends BaseFormComponent {
  public selectedUsers: IUserSearchResult[] = [];
  public get selectedUsersIds(): string[] {
    return this.selectedUsers.map(({ id }) => id);
  }

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
        usersIds: this.selectedUsersIds,
      });
      this.router.navigateByUrl(`boards/${id}`);
    });
  }

  public handleUserSelect(user: IUserSearchResult): void {
    this.selectedUsers.push(user);
  }

  public unselectUser(userId: string): void {
    this.selectedUsers = this.selectedUsers.filter((u) => u.id !== userId);
  }
}
