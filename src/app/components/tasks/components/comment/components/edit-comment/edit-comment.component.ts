import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SnackbarService } from '../../../../../../shared/services/snackbar.service';
import { BaseFormComponent } from '../../../../../../abstract/base-form.component';
import { CommentsService } from '../../services/comments.service';

@Component({
  selector: 'app-edit-comment',
  templateUrl: './edit-comment.component.html',
  styleUrls: ['./edit-comment.component.scss'],
})
export class EditCommentComponent extends BaseFormComponent {
  @Input() commentText!: string;
  @Input() commentId!: string;
  @Input() taskId!: string;
  @Output() updatedEvent = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private commentService: CommentsService,
    private snackbarService: SnackbarService
  ) {
    super();
  }

  public setForm(): void {
    this.componentForm = this.fb.group({
      commentText: [this.commentText, Validators.required],
    });
  }

  public override async handleSubmit(): Promise<void> {
    await super.handleSubmit(async () => {
      await this.commentService.updateComment(
        this.commentId,
        this.componentForm.getRawValue().commentText,
        this.taskId
      );

      await this.commentService.getCommentsByTaskId(this.taskId);
    });

    if (this.error) {
      this.snackbarService.open(this.error);
    }
    
    this.updatedEvent.emit();
  }

  public cancel(): void {
    this.updatedEvent.emit();
  }
}
