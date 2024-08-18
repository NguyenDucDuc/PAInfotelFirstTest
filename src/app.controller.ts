import { Body, Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiExcludeEndpoint()
  @Get('return_url')
  returnUrl() {
    return 'Return URL after payment!';
  }

  @ApiExcludeEndpoint()
  @Get('cancel_url')
  cancelUrl() {
    return 'Cancel URL when payment!';
  }

  @ApiExcludeEndpoint()
  @Get('notify_url')
  notifyUrl(@Body() body: any) {
    return 'Notification URL for payment!';
  }
}
