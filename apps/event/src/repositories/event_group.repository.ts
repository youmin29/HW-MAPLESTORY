/**
File Name : event_group.repository
Description : Event Server - Repository(Group)
Author : 이유민

History
Date        Author      Status      Description
2025.05.19  이유민      Created     
2025.05.19  이유민      Modified    이벤트 그룹 추가
2025.05.19  이유민      Modified    폴더명 수정
2025.05.20  이유민      Modified    코드 리팩토링
*/
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, ClientSession } from 'mongoose';
import { EventGroup } from '@app/entity/event_group.entity';

@Injectable()
export class GroupRepository {
  constructor(
    @InjectModel(EventGroup.name) private groupModel: Model<EventGroup>,
  ) {}

  async create(itemData: Partial<EventGroup>): Promise<EventGroup> {
    return new this.groupModel(itemData).save();
  }

  async findByFilters(filters?: Partial<EventGroup>): Promise<EventGroup[]> {
    return this.groupModel.find(filters).lean().exec();
  }

  async findOneById(id: Types.ObjectId): Promise<EventGroup | null> {
    return this.groupModel.findOne({ _id: id }).lean().exec();
  }

  async updateById(
    id: Types.ObjectId,
    updateData: Partial<EventGroup>,
  ): Promise<EventGroup | null> {
    return this.groupModel.findOneAndUpdate({ _id: id }, updateData).exec();
  }

  async deleteById(
    id: Types.ObjectId,
    session: ClientSession,
  ): Promise<EventGroup | null> {
    return this.groupModel.findOneAndDelete({ _id: id }, { session }).exec();
  }
}
