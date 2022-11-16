import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoardsRoutingModule } from './boards-routing.module';
import { BoardsListComponent } from './boards-list.component';
import { BoardsService } from './boards.service';
import { MatModule } from '../shared/mat.module';
import { BoardComponent } from './board/board.component';
import { TaskComponent } from '../task/task.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommentComponent } from '../task/comment/comment.component';
import { UsersSearchComponent } from '../task/users-search/users-search.component';

@NgModule({
  declarations: [
    BoardsListComponent,
    BoardComponent,
    TaskComponent,
    CommentComponent,
    UsersSearchComponent,
  ],
  imports: [
    CommonModule,
    MatModule,
    BoardsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [BoardsService],
})
export class BoardsModule {}
