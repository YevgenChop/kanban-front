import {
  Component,
  Input,
  ChangeDetectionStrategy,
  OnInit,
  ChangeDetectorRef,
  AfterContentChecked,
} from '@angular/core';
import { UiComponent } from '../../../../../../abstract/ui-component.component';
import { ITaskComment } from '../../../../../../models/task.model';
import { AuthUserStore } from '../../../../../../store/auth-user.store';
import { CommentsService } from '../../services/comments.service';

@Component({
  selector: 'app-comments-list',
  templateUrl: './comments-list.component.html',
  styleUrls: ['./comments-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentsListComponent
  extends UiComponent
  implements OnInit, AfterContentChecked
{
  @Input() taskId!: string;
  @Input() comments!: ITaskComment[];
  public authUserId = this.authUserStore.authUser?.id;
  public isEditMode = false;
  public editedCommentId!: string;

  constructor(
    private commentsService: CommentsService,
    private authUserStore: AuthUserStore,
    private cdRef: ChangeDetectorRef
  ) {
    super();
  }

  ngAfterContentChecked(): void {
    this.cdRef.detectChanges();
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
