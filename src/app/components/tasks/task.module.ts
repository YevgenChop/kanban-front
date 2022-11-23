import { NgModule } from '@angular/core';
import { MatModule } from 'src/app/shared/mat.module';
import { CommentComponent } from './components/comment/comment.component';
import { CommentsListComponent } from './components/comment/components/comments-list/comments-list.component';
import { EditCommentComponent } from './components/comment/components/edit-comment/edit-comment.component';
import { NewCommentComponent } from './components/comment/components/new-comment/new-comment.component';
import { NewTaskComponent } from './components/new-task/new-task.component';
import { TaskComponent } from './task.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    TaskComponent,
    CommentComponent,
    NewTaskComponent,
    NewCommentComponent,
    CommentsListComponent,
    EditCommentComponent,
  ],
  imports: [MatModule, SharedModule],
})
export class TaskModule {}
