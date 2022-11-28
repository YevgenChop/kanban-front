export interface ILoginData {
  password: string;
  login: string;
}

export interface ISignupData extends ILoginData {
  username: string;
  email: string;
}
