export interface IUser {
  id?: number;
  user_name: string;
  email: string;
  password: string;
  full_name: string;
  date_of_birth: string;
  avatar_image_url: string;
  reset_password_token?: string | null;
  reset_password_expires?: Date | null;
}

export interface IRegisterUser {
  id?: number;
  user_name: string;
  email: string;
  password: string;
  confirm_password: string;
  full_name: string;
  date_of_birth: string;
  avatar_image_url: string;
  reset_password_token?: string | null;
  reset_password_expires?: Date | null;
}
