import { IsString, IsNotEmpty, Length } from "class-validator";

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @Length(9, 255)
  public user_name: string;

  @IsString()
  @IsNotEmpty()
  @Length(9, 255)
  public password: string;
}
