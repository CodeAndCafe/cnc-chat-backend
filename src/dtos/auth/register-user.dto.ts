import { IsEmail, IsString, IsNotEmpty, Length } from "class-validator";

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(9, 255)
  public user_name: string;

  @IsEmail()
  @IsNotEmpty()
  @Length(9, 255)
  public email: string;

  @IsString()
  @IsNotEmpty()
  @Length(9, 255)
  public password: string;

  @IsString()
  @IsNotEmpty()
  @Length(9, 255)
  public full_name: string;

  @IsString()
  @IsNotEmpty()
  @Length(9, 255)
  public date_of_birth: string;

  @IsString()
  @IsNotEmpty()
  @Length(9, 255)
  public avatar_image_url: string;
}
