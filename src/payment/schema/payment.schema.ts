import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type PaymentDocument = HydratedDocument<Payment>;

@Schema({ timestamps: true })
export class Payment {
  @Prop({ type: mongoose.Schema.Types.String })
  confirmation_no: string;

  @Prop({ type: mongoose.Schema.Types.String })
  token_code: string;

  @Prop({ type: mongoose.Schema.Types.String })
  status: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
