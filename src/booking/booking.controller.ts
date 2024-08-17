import {
  Body,
  Controller,
  Get,
  OnModuleInit,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import * as xml2js from 'xml2js';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { DOMParser } from 'xmldom';
import { convertXML } from 'simple-xml-to-json';
import * as fs from 'fs';
import * as path from 'path';
import { InjectModel } from '@nestjs/mongoose';
import { Booking, BookingDocument } from './shcema/booking.schema';
import { Model } from 'mongoose';

@ApiTags('Booking')
@Controller('booking')
export class BookingController implements OnModuleInit {
  constructor(
    private readonly bookingService: BookingService,
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
  ) {}
  async onModuleInit() {
    const filePath = path.join(__dirname, '../booking.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const listBooking = await this.bookingModel.find();
    if (!listBooking.length) await this.bookingModel.insertMany(data);
  }

  @Post()
  @UseInterceptors(FileInterceptor('xmlFile'))
  @ApiOperation({ summary: 'Convert XML to JSON' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        xmlFile: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async convertXmlToJson(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    let myJson = convertXML(file.buffer.toString());
    myJson = this.optimizeJSON(myJson);
    return JSON.stringify(myJson, null, 2);
  }

  optimizeJSON(obj) {
    const result = {};

    for (const key in obj) {
      if (obj[key] && typeof obj[key] === 'object') {
        if (Array.isArray(obj[key])) {
          result[key] = obj[key].map((item) => this.optimizeJSON(item));
        } else {
          result[key] = this.optimizeJSON(obj[key]);
        }
      } else {
        result[key] = obj[key];
      }
    }

    return result;
  }

  convertXML(node) {
    if (!node.children) {
      return node.textContent;
    }

    const obj = {};
    for (let i = 0; i < 1000; i++) {
      const child = node.children[i];
      const key = child.tagName.replace(/^\$|^soap:/, '');
      obj[key] = this.convertXML(child);
    }
    return obj;
  }
}
