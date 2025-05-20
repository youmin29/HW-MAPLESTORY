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
2025.05.18  이유민      Modified    코드 리팩토링
2025.05.19  이유민      Modified    폴더명 수정
2025.05.20  이유민      Modified    코드 리팩토링
*/
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, ClientSession, DeleteResult } from 'mongoose';
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
    return new this.rewardModel(rewardData).save({ session });
  }

  async findByFilters(
    filters: Partial<EventReward>,
    shouldPopulate: boolean = true,
  ): Promise<RewardLean[] | null> {
    let query = this.rewardModel.find(filters).lean();

    if (shouldPopulate) query = query.populate('item_id');

    return query.exec();
  }

  async updateRewardById(
    id: string,
    updateData: Partial<EventReward>,
    session: ClientSession,
  ): Promise<RewardLean | null> {
    return this.rewardModel
      .findByIdAndUpdate(id, updateData, { session })
      .exec();
  }

  async deleteRewardById(
    id: string,
    session: ClientSession,
  ): Promise<RewardLean | null> {
    return this.rewardModel.findByIdAndDelete(id, { session }).exec();
  }

  async deleteRewardsByTarget(
    target: Partial<EventReward>,
    session: ClientSession,
  ): Promise<DeleteResult> {
    return this.rewardModel.deleteMany(target, { session }).exec();
  }
}
