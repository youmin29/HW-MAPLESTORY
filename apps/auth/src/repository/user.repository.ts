/**
File Name : user.repository
Description : Auth Server - Repository(User)
Author : 이유민

History
Date        Author      Status      Description
2025.05.14  이유민      Created     
2025.05.14  이유민      Modified    회원 기능 추가
*/
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';
import { User } from '@app/entity/user.entity';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(userData: Partial<User>): Promise<User & Document> {
    return await new this.userModel(userData).save();
  }

  async findOneById(id: string): Promise<User | null> {
    return this.userModel.findOne({ _id: id }).lean().exec();
  }

  async updateUserById(
    id: string,
    updateData: Partial<User>,
  ): Promise<User | null> {
    return await this.userModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });
  }
}
