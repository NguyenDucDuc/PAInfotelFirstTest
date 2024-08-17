import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../user/schema/user.schema';
import { Model } from 'mongoose';
import { LoginDto, RegisterDto } from './dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

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
      return await this.userModel.create({ ...body, password: hashed });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async login(body: LoginDto) {
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
      return {
        accessToken,
        refreshToken: user.refresh_token,
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
