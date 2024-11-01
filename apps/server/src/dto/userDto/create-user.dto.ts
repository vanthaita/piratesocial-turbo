export class CreateUserDto {
  name: string;
  email: string;
  password: string;
  givenName?: string;
  familyName?: string;
  picture?: string;
  providerId?: string;
}
