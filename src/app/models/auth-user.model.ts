import { ITokens } from './tokens.model';

export interface IAuthUser extends ITokens {
  id: string;
  name: string;
  email: string;
  role: string;
  login: string;
}

export interface IUpdateUserData
  extends Omit<IAuthUser, 'id' | 'role' | 'token' | 'refreshToken'> {}
