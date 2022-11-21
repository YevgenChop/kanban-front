import { ITask } from './task.model';
import { IUserSearchResult } from './user-search-result.model';

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
  users: IUserSearchResult[];
}
