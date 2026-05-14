import { IsEmail, IsString, IsNotEmpty, Length } from "class-validator";

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 255)
  public user_name: string;

  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 255)
  public password: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 255)
  public confirm_password: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  public full_name: string;

  @IsString()
  @IsNotEmpty()
  public date_of_birth: string;

  @IsString()
  @IsNotEmpty()
  public avatar_image_url: string;
}
