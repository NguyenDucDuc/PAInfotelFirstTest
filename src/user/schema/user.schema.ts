import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ type: mongoose.Schema.Types.String, unique: true })
  email: string;

  @Prop({ type: mongoose.Schema.Types.String })
  full_name: string;

  @Prop({ type: mongoose.Schema.Types.String })
  phone: string;

  @Prop({ type: mongoose.Schema.Types.String })
  type: string;

  @Prop({ type: mongoose.Schema.Types.String })
  password: string;

  @Prop({ type: mongoose.Schema.Types.String })
  refresh_token: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
