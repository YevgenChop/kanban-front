export interface ITask {
  id: string;
  title: string;
  description: string;
  users: ITaskUser[];
  statusId: string;
  comments: ITaskComment[];
}

export interface ITaskUser {
  id: string;
  name: string;
}

export interface ITaskComment {
  id: string;
  commentText: string;
  user: ITaskUser;
}
