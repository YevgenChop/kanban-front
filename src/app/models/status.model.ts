export interface IStatus {
  id: string;
  title: string;
  custom: boolean;
}

export interface ICreateStatusData {
  boardId: string;
  title: string;
}
