import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  password!: string;

  @IsString()
  role!: string;

  @IsString()
  position!: string;

  @IsString()
  department!: string;
}
