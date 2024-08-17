import {
  Body,
  Controller,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import * as crypto from 'crypto';
import { JwtAuthGuard } from '../../libs/common/src/guards';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiOperation({ summary: 'create payment url with confirmation_no' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':confirmation_no')
  async payment(@Param('confirmation_no') confirmationId: string) {
    return await this.paymentService.payment(confirmationId);
  }

  @ApiOperation({ summary: 'check information payment' })
  @Post(':confirmation_no/check-order')
  async checkOrder(@Param('confirmation_no') confirmationId: string) {
    return await this.paymentService.checkOrder(confirmationId);
  }
}
