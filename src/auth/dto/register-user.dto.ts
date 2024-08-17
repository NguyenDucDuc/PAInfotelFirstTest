import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'nguyenducduc.dev@gmail.com' })
  @IsEmail()
  email: string;

  @IsPhoneNumber()
  @IsOptional()
  phone: string;

  @IsString()
  @IsOptional()
  full_name: string;

  @ApiProperty({ example: 'PhucAn123@' })
  @IsStrongPassword()
  password: string;
}
