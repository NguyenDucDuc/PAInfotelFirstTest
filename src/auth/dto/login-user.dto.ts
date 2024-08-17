import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsStrongPassword } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'nguyenducduc.dev@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'PhucAn123@' })
  @IsStrongPassword()
  password: string;
}
