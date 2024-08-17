import { Body, Controller, Param, Post, UseInterceptors } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import * as crypto from 'crypto';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post(':confirmation_no')
  async payment(@Param('confirmation_no') confirmationId: string) {
    return await this.paymentService.payment(confirmationId);
  }
}
