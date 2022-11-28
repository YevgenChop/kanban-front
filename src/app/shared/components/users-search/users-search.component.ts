import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { debounceTime, takeUntil } from 'rxjs';
import { BaseFormComponent } from '../../../abstract/base-form.component';
import { IUserSearchResult } from '../../../models/user-search-result.model';
import { UserService } from '../../../components/settings/services/user.service';

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

  constructor(private fb: FormBuilder, private userService: UserService) {
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
    this.users = await this.userService.getUsers({
      term,
      boardId: this.boardId,
      skipUserIds: this.skipUserIds,
    });
    this.isLoading = false;
  }

  public async handleClick(user: IUserSearchResult): Promise<void> {
    this.userSelectedEvent.emit(user);
  }

  public onBlur(): void {
    this.componentForm.reset();
  }
}
