import { Length, IsNotEmpty, IsString } from "class-validator";

export class ResetPasswordDto {
  @IsNotEmpty()
  token!: string;

  @IsString()
  @IsNotEmpty()
  @Length(9, 255)
  password!: string;
}
