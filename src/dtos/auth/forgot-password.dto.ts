import { IsEmail, IsNotEmpty, Length } from "class-validator";

export class ForgotPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  @Length(9, 255)
  public email: string;
}
