import { Component, Input } from '@angular/core';
import { UiComponent } from 'src/app/abstract/ui-component.component';
import { ITaskComment } from 'src/app/models/task.model';
import { AuthUserStore } from 'src/app/store/auth-user.store';
import { CommentsService } from '../../services/comments.service';

@Component({
  selector: 'app-comments-list',
  templateUrl: './comments-list.component.html',
  styleUrls: ['./comments-list.component.scss'],
})
export class CommentsListComponent extends UiComponent {
  @Input() taskId!: string;
  @Input() comments!: ITaskComment[];
  public authUserId = this.authUserStore.authUser?.id;
  public isEditMode = false;
  public editedCommentId!: string;

  constructor(
    private commentsService: CommentsService,
    private authUserStore: AuthUserStore
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    await this.commentsService.getCommentsByTaskId(this.taskId);
  }

  public switchEditModeOn(comment: ITaskComment): void {
    this.isEditMode = true;
    this.editedCommentId = comment.id;
  }

  public switchEditModeOff(): void {
    this.isEditMode = false;
    this.editedCommentId = '';
  }

  public async deleteComment(commentId: string, taskId: string): Promise<void> {
    await this.commentsService.deleteComment(commentId, taskId);
  }
}
