import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../user/schema/user.schema';
import { Model } from 'mongoose';
import { LoginDto, RegisterDto } from './dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    //** Inject model */
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(body: RegisterDto): Promise<UserDocument> {
    try {
      const user = await this.userModel.findOne({ email: body.email });
      if (user) throw new BadRequestException('Email already exists!');
      const hashed = await bcrypt.hash(body.password, 10);
      const newUser = await this.userModel.create({
        ...body,
        password: hashed,
      });
      return { ...newUser['_doc'], password: '**********' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async login(body: LoginDto, res: Response) {
    try {
      const { email, password } = body;
      const user = await this.userModel.findOne({ email });
      if (!user) {
        throw new BadRequestException('Email is not valid!');
      }
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword)
        throw new BadRequestException(
          'Password is incorrect, please try again!',
        );
      //** create access token */
      const accessToken = await this.jwtService.signAsync({
        _id: user._id,
        email: user.email,
      });
      const refreshToken = await this.jwtService.signAsync(
        { _id: user._id, email: user.email },
        { expiresIn: '180d' },
      );
      //** update refresh token */
      user.refresh_token = refreshToken;
      await user.save();
      //** set http only */
      res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      });
      res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      });
      return { accessToken, refreshToken };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      const user = await this.userModel.findOne({
        refresh_token: refreshToken,
      });
      if (!user) throw new BadRequestException('Token not valid!');
      //** create new access token */
      const accessToken = await this.jwtService.signAsync({
        _id: user._id,
        email: user.email,
      });
      const newRefreshToken = await this.jwtService.signAsync(
        { _id: user._id, email: user.email },
        { expiresIn: '180d' },
      );
      user.refresh_token = newRefreshToken;
      await user.save();
      return {
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async googleLogin(req: any) {
    try {
      const user = await this.userModel.findOne({ email: req.user.email });
      if (user) {
        return {
          message: `Login success with email: ${user.email}`,
          accessToken: req.user.accessToken,
        };
      }
      const newUser = await this.userModel.create({
        email: req.user.email,
        type: 'GOOGLE',
      });
      return {
        message: `Login success with email: ${newUser.email}`,
        accessToken: req.user.accessToken,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
