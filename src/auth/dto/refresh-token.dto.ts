import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({ example: '' })
  @IsString()
  @IsNotEmpty()
  refresh_token: string;
}
