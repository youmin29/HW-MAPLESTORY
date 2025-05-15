/**
File Name : event_condition.entity
Description : 이벤트 조건 Entity 정의
Author : 이유민

History
Date        Author      Status      Description
2025.05.15  이유민      Created     
2025.05.15  이유민      Modified    이벤트 기능 추가
*/
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ConditionDocument = Condition & Document;

export enum ConditionType {
  ATTEND = 'attend', // 출석
  INVITE = 'invite', // 친구 초대
  QUEST = 'quest', // 특정 퀘스트 수행
  KILL = 'kill', // 몬스터 사냥
  BOSS = 'boss', // 보스
  ITEM = 'item', // 아이템
}

@Schema({ timestamps: true, collection: 'event_condition' })
export class Condition {
  @Prop({ required: true })
  event_id: string;

  @Prop({ required: true, enum: ConditionType })
  type: ConditionType;

  @Prop({})
  target_id?: string;

  @Prop({})
  quantity?: number;
}

export const ConditionSchema = SchemaFactory.createForClass(Condition);
