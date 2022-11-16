import { ITask } from "./task.model";

export interface IBoard {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  tasks: ITask[];
}

