import { IsString, IsNotEmpty, Length } from "class-validator";

export class ChangePasswordDto {
  @IsNotEmpty()
  public user_Id: number;

  @IsString()
  @IsNotEmpty()
  @Length(9, 255)
  public current_password: string;

  @IsString()
  @IsNotEmpty()
  @Length(9, 255)
  public new_password: string;
}
