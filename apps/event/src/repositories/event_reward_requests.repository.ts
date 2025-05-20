/**
File Name : event_reward_requests.repository
Description : Event Server - Repository(Request)
Author : 이유민

History
Date        Author      Status      Description
2025.05.16  이유민      Created     
2025.05.16  이유민      Modified    보상 요청 기능 추가
2025.05.19  이유민      Modified    폴더명 수정
*/
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventRewardRequest } from '@app/entity/event_reward_requests.entity';

@Injectable()
export class RequestRepository {
  constructor(
    @InjectModel(EventRewardRequest.name)
    private requestModel: Model<EventRewardRequest>,
  ) {}

  async create(
    logData: Partial<EventRewardRequest>,
  ): Promise<EventRewardRequest> {
    return new this.requestModel(logData).save();
  }

  async findOneByFilter(
    filters: Partial<EventRewardRequest>,
  ): Promise<EventRewardRequest | null> {
    return this.requestModel.findOne(filters).lean().exec();
  }

  async findByFilter(
    filters: Partial<EventRewardRequest>,
    sortObj: Record<string, 1 | -1>,
  ): Promise<EventRewardRequest[] | null> {
    return this.requestModel
      .find(filters)
      .populate([
        { path: 'user_id', select: '_id name role' },
        { path: 'event_id', select: '_id title start_date end_date status' },
      ])
      .sort(sortObj)
      .lean()
      .exec();
  }
}
