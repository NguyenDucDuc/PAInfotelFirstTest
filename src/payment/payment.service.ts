import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as crypto from 'crypto';
import { Model, Types } from 'mongoose';
import { firstValueFrom } from 'rxjs';
import { Booking, BookingDocument } from '../booking/shcema/booking.schema';

@Injectable()
export class PaymentService {
  constructor(
    private httpService: HttpService,
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
  ) {}
  async createPaymentUrl(body: any) {
    const passCode = process.env.PASS_CODE;
    const hash = crypto.createHash('md5');

    //** call api vietcombank */
    body = {
      function: 'CreateOrder',
      merchant_site_code: 7,
      order_code: new Types.ObjectId().toString(),
      order_description: 'desc',
      amount: 120000,
      currency: 'VND',
      buyer_fullname: 'Nguyen Duc Duc',
      buyer_email: 'nguyenducduc.dev@gmail.com',
      buyer_mobile: '0367879921',
      buyer_address: '371 Nguyen Kiem',
      return_url: 'https://sgod.vn',
      cancel_url: 'https://sgod.vn/cacel',
      notify_url: 'https://sgod.vn/notification',
      language: 'vi',
      version: '1.0',
      payment_method_code: 'ATM-CARD',
      bank_code: 'EXB',
    };
    const rawSignature = `${body.merchant_site_code}|${body.order_code}|${body.order_description}|${body.amount}|${body.currency}|${body.buyer_fullname}|${body.buyer_email}|${body.buyer_mobile}|${body.buyer_address}|${body.return_url}|${body.cancel_url}|${body.notify_url}|${body.language}|${passCode}`;
    const updateRawSignature = hash.update(rawSignature);
    const signature = updateRawSignature.digest('hex');
    body.checksum = signature;
    const result = await firstValueFrom(
      this.httpService.post(process.env.VIETCOMBANK_PAYMENT, body, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    );
    return result.data;
  }

  async payment(confirmationId: string) {
    try {
      const passCode = process.env.PASS_CODE;
      const hash = crypto.createHash('md5');
      const bookingInfor = await this.bookingModel.findOne({
        confirmation_no: confirmationId,
      });
      if (!bookingInfor) {
        throw new BadRequestException('Booking not found!');
      }
      const body = {
        function: 'CreateOrder',
        merchant_site_code: 7,
        order_code: new Types.ObjectId().toString(),
        order_description: 'desc',
        amount: bookingInfor.rateamount.amount,
        currency: bookingInfor.rateamount.currency,
        buyer_fullname: `${bookingInfor.first_name} ${bookingInfor.last_name}`,
        buyer_email: bookingInfor.email,
        buyer_mobile: bookingInfor.phone_number,
        buyer_address: '371 Nguyen Kiem',
        return_url: 'http://localhost:3333/return_url',
        cancel_url: 'http://localhost:3333/cancel_url',
        notify_url: 'http://localhost:3333/notify_url',
        language: 'vi',
        version: '1.0',
        payment_method_code: bookingInfor.method_payment,
        bank_code: 'EXB',
      };
      const rawSignature = `${body.merchant_site_code}|${body.order_code}|${body.order_description}|${body.amount}|${body.currency}|${body.buyer_fullname}|${body.buyer_email}|${body.buyer_mobile}|${body.buyer_address}|${body.return_url}|${body.cancel_url}|${body.notify_url}|${body.language}|${passCode}`;
      const updateRawSignature = hash.update(rawSignature);
      const signature = updateRawSignature.digest('hex');
      body['checksum'] = signature;
      const result = await firstValueFrom(
        this.httpService.post(process.env.VIETCOMBANK_PAYMENT, body, {
          headers: { 'Content-Type': 'multipart/form-data' },
        }),
      );
      return result.data;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
