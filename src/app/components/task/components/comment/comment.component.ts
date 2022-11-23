import { Component, Input } from '@angular/core';
import { ITaskComment } from '../../../../models/task.model';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent {
  @Input() taskId!: string;
  @Input() comments!: ITaskComment[];
}
