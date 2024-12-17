import { IsEmail, IsString,IsNotEmpty} from 'class-validator';
export class CreateAuthDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  password: string;


}
export class UserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  givenName: string;

  @IsString()
  familyName: string;

  @IsString()
  picture: string;

  @IsString()
  providerId: string;
}

export class SignInDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}