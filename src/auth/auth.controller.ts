import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RefreshTokenDto, RegisterDto } from './dto';
import {
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../libs/common/src/guards';
import { IReqWithUser } from '../../libs/common/src/interfaces';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register new user with email and password' })
  @Post()
  async register(@Body() body: RegisterDto) {
    return await this.authService.register(body);
  }

  @ApiOperation({ summary: 'Login with username and password' })
  @Post('login')
  async login(@Body() body: LoginDto) {
    return await this.authService.login(body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('refresh-token')
  async refreshToken(@Req() req: IReqWithUser) {
    const refreshToken = req.headers.authorization.split(' ')[1];
    return await this.authService.refreshToken(refreshToken);
  }

  @ApiOperation({ summary: 'Login with google' })
  @Get('google-login')
  googleLoginUrl(@Res() res: Response) {
    return res.json({
      message: 'click to link bellow',
      url: 'http://localhost:3333/auth/google',
    });
  }

  @ApiExcludeEndpoint()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @ApiExcludeEndpoint()
  @Get('redirect')
  @UseGuards(AuthGuard('google'))
  async redirect(@Req() req) {
    return await this.authService.googleLogin(req);
  }
}
