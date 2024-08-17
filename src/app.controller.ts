import { Body, Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('return_url')
  returnUrl() {
    return 'Return URL after payment!';
  }

  @Get('cancel_url')
  cancelUrl() {
    return 'Cancel URL when payment!';
  }

  @Get('notify_url')
  notifyUrl(@Body() body: any) {
    console.log(body);

    return 'Notification URL for payment!';
  }
}
