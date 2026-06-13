import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class LoginDto {
  // this is basically an identifier to identify on the basis of email/username
  @IsString()
  @IsNotEmpty()
  @MaxLength(320)
  identifier!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  password!: string;
}
