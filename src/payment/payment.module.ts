import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from '../booking/shcema/booking.schema';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
