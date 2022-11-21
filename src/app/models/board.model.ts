import { ITask } from './task.model';

export interface IBoard {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  tasks: ITask[];
}

export interface INewBoardData extends Pick<IBoard, 'title' | 'description'> {
  usersIds: string[];
}

export interface IBoardWithUsers extends Omit<IBoard, 'tasks'> {
  users: { id: string; name: string; email: string }[];
}
