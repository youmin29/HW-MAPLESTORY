/**
File Name : event_condition.repository
Description : Event Server - Repository(Condition)
Author : 이유민

History
Date        Author      Status      Description
2025.05.15  이유민      Created     
2025.05.15  이유민      Modified    이벤트 기능 추가
*/
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Condition } from '@app/entity/event_condition.entity';

// type RewardLean = EventReward & { _id: Types.ObjectId };

@Injectable()
export class ConditionRepository {
  constructor(
    @InjectModel(Condition.name)
    private conditionModel: Model<Condition>,
  ) {}

  async createCondition(conditionData: Partial<Condition>): Promise<Condition> {
    return await new this.conditionModel(conditionData).save();
  }
}
