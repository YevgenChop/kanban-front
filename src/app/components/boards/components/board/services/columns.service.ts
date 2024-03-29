import { Injectable } from '@angular/core';
import { IStatus } from '../../../../../models/status.model';
import { ITask } from '../../../../../models/task.model';
import { AuthUserStore } from '../../../../../store/auth-user.store';

@Injectable({
  providedIn: 'root',
})
export class ColumnsService {
  private authUserId = this.authUserStore.authUser?.id;
  constructor(private authUserStore: AuthUserStore) {}

  public mapTasksToColumns(
    columns: IStatus[],
    tasks: ITask[]
  ): { [key: string]: ITask[] } {
    const dictionary: { [key: string]: ITask[] } = {};

    for (const { title, id } of columns) {
      if (!dictionary[title]) dictionary[title] = [];

      dictionary[title] = tasks.filter((t) => t.statusId === id);
    }

    return dictionary;
  }

  public getColumns(boardId: string, statuses: string[]): string[] {
    const savedColumns = localStorage.getItem(`${this.authUserId}${boardId}`);
    if (!savedColumns) return statuses;

    const refreshedColumns = [
      ...new Set([
        ...JSON.parse(savedColumns).filter((c: string) => statuses.includes(c)),
        ...statuses,
      ]),
    ];

    this.saveColumnsOrder(boardId, refreshedColumns);

    return refreshedColumns;
  }

  public saveColumnsOrder(boardId: string, columns: string[]): void {
    localStorage.setItem(
      `${this.authUserId}${boardId}`,
      JSON.stringify(columns)
    );
  }
}
