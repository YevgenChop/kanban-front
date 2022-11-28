import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import { ITask } from '../../../../../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class DragAndDropService {
  public async dropTask(
    event: CdkDragDrop<{ tasks: ITask[]; statusTitle: string }>
  ): Promise<void> {
    if (event.previousContainer === event.container) {
      return moveItemInArray(
        event.container.data.tasks,
        event.previousIndex,
        event.currentIndex
      );
    }

    transferArrayItem(
      event.previousContainer.data.tasks,
      event.container.data.tasks,
      event.previousIndex,
      event.currentIndex
    );
  }

  public dropColumn(event: CdkDragDrop<string[]>): void {
    moveItemInArray(
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  }

  public putTaskBack(
    event: CdkDragDrop<{ tasks: ITask[]; statusTitle: string }>
  ) {
    transferArrayItem(
      event.container.data.tasks,
      event.previousContainer.data.tasks,
      event.currentIndex,
      event.previousIndex
    );
  }
}
