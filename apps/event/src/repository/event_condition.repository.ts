/**
File Name : event_condition.repository
Description : Event Server - Repository(Condition)
Author : 이유민

History
Date        Author      Status      Description
2025.05.15  이유민      Created     
2025.05.15  이유민      Modified    이벤트 기능 추가
2025.05.16  이유민      Modified    트랜잭션 추가
2025.05.16  이유민      Modified    보상 요청 기능 추가
*/
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ClientSession, Types } from 'mongoose';
import { Condition } from '@app/entity/event_condition.entity';

type ConditionLean = Condition & { _id: Types.ObjectId };

@Injectable()
export class ConditionRepository {
  constructor(
    @InjectModel(Condition.name)
    private conditionModel: Model<Condition>,
  ) {}

  async createCondition(
    conditionData: Partial<Condition>,
    session: ClientSession,
  ): Promise<Condition> {
    return await new this.conditionModel(conditionData).save({ session });
  }

  async findConditionsByFilters(
    filters: Partial<Condition>,
  ): Promise<ConditionLean[] | null> {
    return await this.conditionModel.find(filters).lean();
  }

  async deleteConditionsByTarget(
    target: Partial<Condition>,
    session: ClientSession,
  ): Promise<object> {
    await this.conditionModel.deleteMany(target, { session });
    return { message: '성공적으로 삭제되었습니다.' };
  }
}
