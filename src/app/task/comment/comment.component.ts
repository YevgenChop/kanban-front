import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BaseFormComponent } from '../../abstract/base-form.component';
import { ITaskComment } from '../../models/task.model';
import { TasksService } from '../../task/tasks.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent extends BaseFormComponent {
  @Input() taskId!: string;
  @Input() comments!: ITaskComment[];

  constructor(private fb: FormBuilder, private tasksService: TasksService) {
    super();
  }

  public setForm(): void {
    this.componentForm = this.fb.group({
      commentText: [''],
    });
  }

  public override async handleSubmit(): Promise<void> {
    await super.handleSubmit(
      async () =>
        await this.tasksService.leaveComment(
          this.taskId,
          this.componentForm.getRawValue().commentText
        )
    );
  }
}
