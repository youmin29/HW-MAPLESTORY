/**
File Name : event_reward.repository
Description : Event Server - Repository(Reward)
Author : 이유민

History
Date        Author      Status      Description
2025.05.15  이유민      Created     
2025.05.15  이유민      Modified    이벤트 기능 추가
*/
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { EventReward } from '@app/entity/event_reward.entity';

type RewardLean = EventReward & { _id: Types.ObjectId };

@Injectable()
export class EventRewardRepository {
  constructor(
    @InjectModel(EventReward.name)
    private rewardModel: Model<EventReward>,
  ) {}

  async createReward(rewardData: Partial<EventReward>): Promise<EventReward> {
    return await new this.rewardModel(rewardData).save();
  }

  async findByFilters(
    filters: Partial<EventReward>,
  ): Promise<RewardLean[] | null> {
    return await this.rewardModel.find(filters).lean();
  }

  async updateRewardById(
    id: string,
    updateData: Partial<EventReward>,
  ): Promise<object> {
    await this.rewardModel.findByIdAndUpdate(id, updateData);
    return { message: '성공적으로 수정되었습니다.' };
  }

  async deleteRewardById(id: string): Promise<object> {
    await this.rewardModel.findByIdAndDelete(id);
    return { message: '성공적으로 삭제되었습니다.' };
  }
}
