export interface ITask {
  id: string;
  title: string;
  description: string;
  users: ITaskUser[];
  statusId: string;
  boardId: string;
  comments: ITaskComment[];
  createdDate: string;
}

export interface ITaskUser {
  id: string;
  name: string;
}

export interface ITaskComment {
  id: string;
  commentText: string;
  userId: string;
  taskId: string;
  username: string;
  updatedDate: string;
  createdDate: string;
}

export interface IUpdateTaskData extends Pick<ITask, 'title' | 'description'> {}

export interface ICreateTaskData
  extends Pick<ITask, 'title' | 'description' | 'statusId'> {
  boardId: string;
  usersIds: string[];
}
