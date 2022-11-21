import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthUserStore } from '../../../../store/auth-user.store';
import { BaseFormComponent } from '../../../../abstract/base-form.component';
import { ITaskComment } from '../../../../models/task.model';
import { CommentsService } from './comments.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent extends BaseFormComponent implements OnInit {
  @Input() taskId!: string;
  @Input() comments!: ITaskComment[];
  public authUserId = this.authUserStore.authUser?.id;
  public isEditMode = false;
  public commentId!: string;

  constructor(
    private fb: FormBuilder,
    private commentsService: CommentsService,
    private authUserStore: AuthUserStore
  ) {
    super();
  }

  override async ngOnInit(): Promise<void> {
    super.ngOnInit();
    await this.commentsService.getCommentsByTaskId(this.taskId);
  }

  public setForm(): void {
    this.componentForm = this.fb.group({
      commentText: [''],
    });
  }

  public switchEditModeOn(comment: ITaskComment): void {
    this.isEditMode = true;
    this.componentForm = this.fb.group({
      commentText: [comment.commentText],
    });
    this.commentId = comment.id;
  }

  public switchEditModeOff(): void {
    this.isEditMode = false;
    this.commentId = '';
    this.componentForm.reset();
  }

  public override async handleSubmit(): Promise<void> {
    await super.handleSubmit(async () => {
      if (!this.isEditMode) {
        await this.commentsService.leaveComment(
          this.taskId,
          this.componentForm.getRawValue().commentText
        );
      } else {
        await this.commentsService.updateComment(
          this.commentId,
          this.componentForm.getRawValue().commentText,
          this.taskId
        );
        this.switchEditModeOff();
      }

      await this.commentsService.getCommentsByTaskId(this.taskId);
    });
  }

  public async deleteComment(commentId: string, taskId: string): Promise<void> {
    this.switchEditModeOff();
    await this.commentsService.deleteComment(commentId, taskId);
  }
}
