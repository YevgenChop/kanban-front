import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ITask } from '../models/task.model';
@Injectable({
  providedIn: 'root',
})
export class TasksStore {
  public tasks$: BehaviorSubject<ITask[]> = new BehaviorSubject<ITask[]>([]);

  public get tasks(): ITask[] {
    return this.tasks$.getValue();
  }
}
