import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoardsRoutingModule } from './boards-routing.module';
import { BoardsListComponent } from './boards-list.component';
import { BoardsService } from './services/boards.service';
import { MatModule } from '../../shared/mat.module';
import { BoardComponent } from './components/board/board.component';
import { TaskComponent } from '../task/task.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommentComponent } from '../task/components/comment/comment.component';
import { UsersSearchComponent } from '../shared/users-search/users-search.component';
import { NewBoardComponent } from './components/new-board/new-board.component';
import { NewTaskComponent } from '../task/components/new-task/new-task.component';
import { EditBoardComponent } from './components/edit-board/edit-board.component';

@NgModule({
  declarations: [
    BoardsListComponent,
    BoardComponent,
    TaskComponent,
    CommentComponent,
    UsersSearchComponent,
    NewBoardComponent,
    NewTaskComponent,
    EditBoardComponent,
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
