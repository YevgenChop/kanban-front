import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IUserSearchResult } from '../../../models/user-search-result.model';

@Component({
  selector: 'app-assigned-users',
  templateUrl: './assigned-users.component.html',
  styleUrls: ['./assigned-users.component.scss'],
})
export class AssignedUsersComponent {
  @Input() users!: IUserSearchResult[];
  @Output() unselectEvent = new EventEmitter<string>();
  constructor() {}

  public handleClick(id: string): void {
    this.unselectEvent.emit(id);
  }
}
