import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BaseFormComponent } from 'src/app/abstract/base-form.component';
import { CommentsService } from '../../services/comments.service';

@Component({
  selector: 'app-new-comment',
  templateUrl: './new-comment.component.html',
  styleUrls: ['./new-comment.component.scss'],
})
export class NewCommentComponent extends BaseFormComponent {
  @Input() taskId!: string;

  constructor(
    private fb: FormBuilder,
    private commentsService: CommentsService
  ) {
    super();
  }

  public setForm(): void {
    this.componentForm = this.fb.group({
      commentText: [''],
    });
  }

  public override async handleSubmit(): Promise<void> {
    await super.handleSubmit(async () => {
      await this.commentsService.leaveComment(
        this.taskId,
        this.componentForm.getRawValue().commentText
      );
      await this.commentsService.getCommentsByTaskId(this.taskId);
    });
  }
}
