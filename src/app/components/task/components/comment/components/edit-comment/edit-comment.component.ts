import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseFormComponent } from 'src/app/abstract/base-form.component';
import { CommentsService } from '../../comments.service';

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
    private snackbar: MatSnackBar
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
      return this.openSnackbar(this.error);
    }

    this.openSnackbar('Comment updated');
    this.updatedEvent.emit();
  }

  public openSnackbar(message: string): void {
    this.snackbar.open(message, undefined, { duration: 3000 });
  }

  public cancel(): void {
    this.updatedEvent.emit();
  }
}
