/**
File Name : auth.repository
Description : Auth Server - Repository
Author : 이유민

History
Date        Author      Status      Description
2025.05.14  이유민      Created     
2025.05.14  이유민      Modified    회원 기능 추가
2025.05.18  이유민      Modified    트랙잭션 추가
2025.05.19  이유민      Modified    코드 리팩토링
*/
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ClientSession } from 'mongoose';
import { Auth } from '@app/entity/auth.entity';

@Injectable()
export class AuthRepository {
  constructor(@InjectModel(Auth.name) private authModel: Model<Auth>) {}

  async create(authData: Partial<Auth>, session: ClientSession): Promise<Auth> {
    return await new this.authModel(authData).save({ session });
  }

  async findOneByEmail(email: string): Promise<Auth | null> {
    return await this.authModel.findOne({ email }).exec();
  }
}
