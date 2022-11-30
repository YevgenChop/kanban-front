import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersSearchComponent } from './components/users-search/users-search.component';
import { AssignedUsersComponent } from './components/assigned-users/assigned-users.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { MatModule } from './mat.module';
import { AutofocusDirective } from '../directives/autofocus.directive';

@NgModule({
  declarations: [
    UsersSearchComponent,
    ConfirmDialogComponent,
    AssignedUsersComponent,
    AutofocusDirective,
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatModule],
  exports: [
    UsersSearchComponent,
    AssignedUsersComponent,
    AutofocusDirective,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class SharedModule {}
