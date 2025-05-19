/**
File Name : event.repository
Description : Event Server - Repository
Author : 이유민

History
Date        Author      Status      Description
2025.05.15  이유민      Created     
2025.05.15  이유민      Modified    이벤트 기능 추가
2025.05.16  이유민      Modified    트랜잭션 추가
2025.05.16  이유민      Modified    코드 리팩토링
2025.05.19  이유민      Modified    폴더명 수정
2025.05.20  이유민      Modified    코드 리팩토링
*/
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, ClientSession } from 'mongoose';
import { EventInfo } from '@app/entity/event_info.entity';

type EventLean = EventInfo & { _id: Types.ObjectId };

@Injectable()
export class EventRepository {
  constructor(
    @InjectModel(EventInfo.name) private eventModel: Model<EventInfo>,
  ) {}

  async create(
    eventData: Partial<EventInfo>,
    session: ClientSession,
  ): Promise<EventLean> {
    return new this.eventModel(eventData).save({ session });
  }

  async findEventbyFilters(filters?: Partial<EventInfo>): Promise<EventInfo[]> {
    return this.eventModel.find(filters).lean().exec();
  }

  async findEventById(id: string): Promise<EventLean | null> {
    return this.eventModel.findOne({ _id: id }).lean().exec();
  }

  async updateEventById(
    id: string,
    updateData: Partial<EventInfo>,
    session: ClientSession,
  ): Promise<EventInfo | null> {
    return this.eventModel
      .findByIdAndUpdate(id, updateData, { session })
      .exec();
  }

  async deleteEventById(
    id: string,
    session: ClientSession,
  ): Promise<EventInfo | null> {
    return this.eventModel.findByIdAndDelete(id, { session }).exec();
  }
}
