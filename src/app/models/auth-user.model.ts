export interface IAuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  token: string;
  login: string;
}

export interface IUpdateUserData
  extends Omit<IAuthUser, 'id' | 'role' | 'token'> {}
