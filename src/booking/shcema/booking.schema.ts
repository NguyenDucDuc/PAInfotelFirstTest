import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type BookingDocument = HydratedDocument<Booking>;

@Schema({ timestamps: true })
export class Booking {
  @Prop({ type: mongoose.Schema.Types.String, unique: true })
  confirmation_no: string;

  @Prop({ type: mongoose.Schema.Types.String })
  resv_name_id: string;

  @Prop({ type: mongoose.Schema.Types.Date })
  arrival: string;

  @Prop({ type: mongoose.Schema.Types.Date })
  departure: string;

  @Prop({ type: mongoose.Schema.Types.Number })
  adults: number;

  @Prop({ type: mongoose.Schema.Types.Number })
  children: number;

  @Prop({ type: mongoose.Schema.Types.String })
  roomtype: string;

  @Prop({ type: mongoose.Schema.Types.String })
  ratecode: string;

  @Prop({
    type: {
      amount: mongoose.Schema.Types.Number,
      currency: mongoose.Schema.Types.String,
      _id: false,
    },
  })
  rateamount: {
    amount: number;
    currency: string;
  };

  @Prop({ type: mongoose.Schema.Types.String })
  guarantee: string;

  @Prop({ type: mongoose.Schema.Types.String })
  method_payment: string;

  @Prop({ type: mongoose.Schema.Types.String })
  computed_resv_status: string;

  @Prop({ type: mongoose.Schema.Types.String })
  last_name: string;

  @Prop({ type: mongoose.Schema.Types.String })
  first_name: string;

  @Prop({ type: mongoose.Schema.Types.String })
  title: string;

  @Prop({ type: mongoose.Schema.Types.String })
  phone_number: string;

  @Prop({ type: mongoose.Schema.Types.String })
  email: string;

  @Prop({ type: mongoose.Schema.Types.String })
  booking_balance: string;

  @Prop({ type: mongoose.Schema.Types.Date })
  booking_created_date: string;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
