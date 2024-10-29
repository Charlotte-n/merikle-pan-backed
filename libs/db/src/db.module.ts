import { Global, Module } from '@nestjs/common';
import { DbService } from './db.service';
import 'reflect-metadata';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../models/user.model';
import { Share, ShareSchema } from '../models/share.model';
import { FileSchema, File } from '../models/file_info.model';
import { CommonFileSchema, CommonFile } from '../models/commonFile.model';
import { ConfigService } from '@nestjs/config';
import { MongoClient } from 'mongodb';
const models = MongooseModule.forFeature([
  { name: User.name, schema: UserSchema },
  { name: File.name, schema: FileSchema },
  { name: Share.name, schema: ShareSchema },
  { name: CommonFile.name, schema: CommonFileSchema },
]);

@Global()
@Module({
  imports: [
    MongooseModule.forRoot(
      `${process.env.NODE_ENV === 'production' ? 'mongodb://merikle-pan-mongo:27017/pan?authSource=admin' : 'mongodb://127.0.0.1:27017/pan?authSource=admin'}`,
      {
        user: 'mongo_pcwdfZ',
        pass: 'mongo_ZJ2sE2',
      },
    ),
    models,
  ],
  providers: [DbService],
  exports: [DbService, MongooseModule],
})
export class DbModule {}
