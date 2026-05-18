import { IsString, IsNotEmpty, Length } from "class-validator";

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  @Length(8, 255)
  public current_password: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 255)
  public new_password: string;
}
