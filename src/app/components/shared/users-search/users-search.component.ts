import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { debounceTime, takeUntil } from 'rxjs';
import { BaseFormComponent } from 'src/app/abstract/base-form.component';
import { UsersService } from './users.service';

@Component({
  selector: 'app-users-search',
  templateUrl: './users-search.component.html',
  styleUrls: ['./users-search.component.scss'],
})
export class UsersSearchComponent extends BaseFormComponent implements OnInit {
  public users!: { id: string; email: string; name: string }[];
  @Output() userSelectedEvent = new EventEmitter<{
    id: string;
    email: string;
    name: string;
  }>();

  constructor(private fb: FormBuilder, private usersService: UsersService) {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.componentForm.valueChanges
      .pipe(debounceTime(300), takeUntil(this.notifier$))
      .subscribe((change) =>
        change.user ? this.setUsers(change.user) : (this.users = [])
      );
  }

  public setForm(): void {
    this.componentForm = this.fb.group({
      user: '',
    });
  }

  private async setUsers(term: string): Promise<void> {
    this.isLoading = true;
    this.users = await this.usersService.getUsers(term);
    this.isLoading = false;
  }

  public async handleClick(user: {
    id: string;
    email: string;
    name: string;
  }): Promise<void> {
    this.userSelectedEvent.emit(user);
  }

  public onBlur(): void {
    this.componentForm.reset();
  }
}
