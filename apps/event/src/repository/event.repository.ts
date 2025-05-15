/**
File Name : event.repository
Description : Event Server - Repository
Author : 이유민

History
Date        Author      Status      Description
2025.05.15  이유민      Created     
2025.05.15  이유민      Modified    이벤트 기능 추가
*/
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document, Types } from 'mongoose';
import { EventInfo } from '@app/entity/event_info.entity';

type EventLean = EventInfo & { _id: Types.ObjectId };

@Injectable()
export class EventRepository {
  constructor(
    @InjectModel(EventInfo.name) private eventModel: Model<EventInfo>,
  ) {}

  async create(eventData: Partial<EventInfo>): Promise<EventInfo & Document> {
    return await new this.eventModel(eventData).save();
  }

  async findEventAll(): Promise<EventInfo[]> {
    return await this.eventModel.find().lean();
  }

  async findEventById(id: string): Promise<EventLean | null> {
    return await this.eventModel.findOne({ _id: id }).lean().exec();
  }

  async updateEventById(
    id: string,
    updateData: Partial<EventInfo>,
  ): Promise<object> {
    await this.eventModel.findByIdAndUpdate(id, updateData);
    return { message: '성공적으로 수정되었습니다.' };
  }

  async deleteEventById(id: string): Promise<object> {
    await this.eventModel.findByIdAndDelete(id);
    return { message: '성공적으로 삭제되었습니다.' };
  }
}
