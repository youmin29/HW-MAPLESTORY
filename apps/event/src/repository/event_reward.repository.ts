/**
File Name : event_reward.repository
Description : Event Server - Repository(Reward)
Author : 이유민

History
Date        Author      Status      Description
2025.05.15  이유민      Created     
2025.05.15  이유민      Modified    이벤트 기능 추가
2025.05.16  이유민      Modified    트랜잭션 추가
2025.05.16  이유민      Modified    코드 리팩토링
*/
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, ClientSession } from 'mongoose';
import { EventReward } from '@app/entity/event_reward.entity';

type RewardLean = EventReward & { _id: Types.ObjectId };

@Injectable()
export class EventRewardRepository {
  constructor(
    @InjectModel(EventReward.name)
    private rewardModel: Model<EventReward>,
  ) {}

  async createReward(
    rewardData: Partial<EventReward>,
    session: ClientSession,
  ): Promise<EventReward> {
    return await new this.rewardModel(rewardData).save({ session });
  }

  async findByFilters(
    filters: Partial<EventReward>,
  ): Promise<RewardLean[] | null> {
    return await this.rewardModel
      .find(filters)
      .populate('item_id')
      .lean()
      .exec();
  }

  async updateRewardById(
    id: string,
    updateData: Partial<EventReward>,
    session: ClientSession,
  ): Promise<object> {
    await this.rewardModel.findByIdAndUpdate(id, updateData, { session });
    return { message: '성공적으로 수정되었습니다.' };
  }

  async deleteRewardById(id: string, session: ClientSession): Promise<object> {
    await this.rewardModel.findByIdAndDelete(id, { session });
    return { message: '성공적으로 삭제되었습니다.' };
  }

  async deleteRewardsByTarget(
    target: Partial<EventReward>,
    session: ClientSession,
  ): Promise<object> {
    await this.rewardModel.deleteMany(target, { session });
    return { message: '성공적으로 삭제되었습니다.' };
  }
}
