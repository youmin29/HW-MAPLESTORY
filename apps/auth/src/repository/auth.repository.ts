/**
File Name : auth.repository
Description : Auth Server - Repository
Author : 이유민

History
Date        Author      Status      Description
2025.05.14  이유민      Created     
2025.05.14  이유민      Modified    회원 기능 추가
2025.05.18  이유민      Modified    트랙잭션 추가
*/
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ClientSession } from 'mongoose';
import { Auth } from '@app/entity/auth.entity';

@Injectable()
export class AuthRepository {
  constructor(@InjectModel(Auth.name) private authModel: Model<Auth>) {}

  async create(
    authData: Partial<Auth>,
    user_id: string,
    session: ClientSession,
  ): Promise<Auth> {
    const newAuth = new this.authModel({
      email: authData.email,
      password: authData.password,
      user_id,
    });
    return await newAuth.save({ session });
  }

  async findOneByEmail(email: string): Promise<Auth | null> {
    return this.authModel.findOne({ email }).exec();
  }
}
