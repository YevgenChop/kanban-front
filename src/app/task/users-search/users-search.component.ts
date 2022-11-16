import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { BaseFormComponent } from 'src/app/abstract/base-form.component';
import { TasksService } from '../tasks.service';
import { UsersService } from './users.service';

@Component({
  selector: 'app-users-search',
  templateUrl: './users-search.component.html',
  styleUrls: ['./users-search.component.scss'],
})
export class UsersSearchComponent extends BaseFormComponent implements OnInit {
  public users!: { id: string; email: string; name: string }[];
  @Input() taskId!: string;
  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private taskService: TasksService
  ) {
    super();
  }

  public setForm(): void {
    this.componentForm = this.fb.group({
      user: '',
    });
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.componentForm.valueChanges
      .pipe(debounceTime(300))
      .subscribe((change) =>
        change.user ? this.setUsers(change.user) : (this.users = [])
      );
  }

  public async setUsers(term: string): Promise<void> {
    this.isLoading = true;
    this.users = await this.usersService.getUsers(term);
    this.isLoading = false;
  }

  public async assignTask(user: {
    id: string;
    email: string;
    name: string;
  }): Promise<void> {
    await this.taskService.assignTask(user, this.taskId);
  }

  public onBlur(): void {
    this.componentForm.reset();
  }
}
