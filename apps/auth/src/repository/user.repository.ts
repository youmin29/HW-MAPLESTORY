/**
File Name : user.repository
Description : Auth Server - Repository(User)
Author : 이유민

History
Date        Author      Status      Description
2025.05.14  이유민      Created     
2025.05.14  이유민      Modified    회원 기능 추가
2025.05.18  이유민      Modified    트랙잭션 추가
2025.05.19  이유민      Modified    Mongoose ref 설정 추가
2025.05.20  이유민      Modified    코드 리팩토링
2025.05.20  이유민      Modified    유저 API 추가
*/
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ClientSession, Types } from 'mongoose';
import { User } from '@app/entity/user.entity';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(
    userData: Partial<User>,
    session: ClientSession,
  ): Promise<User & { _id: Types.ObjectId }> {
    return new this.userModel(userData).save({ session });
  }

  async findUsersByFilters(filters?: Partial<User>): Promise<User[] | null> {
    return this.userModel.find(filters).lean().exec();
  }

  async findOneById(id: Types.ObjectId): Promise<User | null> {
    return this.userModel.findOne({ _id: id }).lean().exec();
  }

  async updateUserById(
    id: Types.ObjectId,
    updateData: Partial<User>,
  ): Promise<User | null> {
    return this.userModel.findByIdAndUpdate({ _id: id }, updateData).exec();
  }
}
