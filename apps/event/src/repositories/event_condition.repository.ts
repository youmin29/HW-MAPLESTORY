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
2025.05.18  이유민      Modified    이벤트 정보 수정 변경
2025.05.19  이유민      Modified    폴더명 수정
2025.05.20  이유민      Modified    코드 리팩토링
*/
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ClientSession, Types, DeleteResult } from 'mongoose';
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
    return new this.conditionModel(conditionData).save({ session });
  }

  async findConditionsByFilters(
    filters: Partial<Condition>,
  ): Promise<ConditionLean[] | null> {
    return this.conditionModel.find(filters).lean().exec();
  }

  async updateConditionsById(
    id: string,
    updateData: Partial<Condition>,
    session: ClientSession,
  ): Promise<Condition | null> {
    return this.conditionModel
      .findByIdAndUpdate(id, updateData, {
        session,
      })
      .exec();
  }

  async deleteConditionsByTarget(
    target: Partial<ConditionLean>,
    session: ClientSession,
  ): Promise<DeleteResult> {
    return this.conditionModel.deleteMany(target, { session }).exec();
  }
}
