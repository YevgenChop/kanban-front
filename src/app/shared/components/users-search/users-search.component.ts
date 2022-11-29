import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { debounceTime, takeUntil } from 'rxjs';
import { BaseFormComponent } from '../../../abstract/base-form.component';
import { IUserSearchResult } from '../../../models/user-search-result.model';
import { UserService } from '../../../components/settings/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-users-search',
  templateUrl: './users-search.component.html',
  styleUrls: ['./users-search.component.scss'],
})
export class UsersSearchComponent extends BaseFormComponent implements OnInit {
  public users!: IUserSearchResult[];
  @Input() boardId?: string;
  @Input() skipUserIds?: string[];
  @Output() userSelectedEvent = new EventEmitter<IUserSearchResult>();

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private snackbar: MatSnackBar
  ) {
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
    try {
      this.users = await this.userService.getUsers({
        term,
        boardId: this.boardId,
        skipUserIds: this.skipUserIds,
      });
    } catch (error) {
      this.snackbar.open(error as string, undefined, { duration: 3000 });
    }

    this.isLoading = false;
  }

  public async handleClick(user: IUserSearchResult): Promise<void> {
    this.userSelectedEvent.emit(user);
  }

  public onBlur(): void {
    this.componentForm.reset();
  }
}
