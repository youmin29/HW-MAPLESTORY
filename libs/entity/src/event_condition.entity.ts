/**
File Name : event_condition.entity
Description : 이벤트 조건 Entity 정의
Author : 이유민

History
Date        Author      Status      Description
2025.05.15  이유민      Created     
2025.05.15  이유민      Modified    이벤트 기능 추가
2025.05.16  이유민      Modified    Mongoose ref 설정 추가
2025.05.19  이유민      Modified    ConditionType 수정
2025.05.20  이유민      Modified    속성 수정
*/
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { EventInfo } from './event_info.entity';
import { Document, Types } from 'mongoose';
import { Item } from './item.entity';

export type ConditionDocument = Condition & Document;

export enum ConditionType {
  ATTEND = 'attend', // 출석
  ITEM = 'item', // 아이템
}

@Schema({ timestamps: true, collection: 'event_condition' })
export class Condition {
  @Prop({ type: Types.ObjectId, ref: EventInfo.name })
  event_id: Types.ObjectId;

  @Prop({ required: true, enum: ConditionType })
  type: ConditionType;

  @Prop({ type: Types.ObjectId, ref: Item.name })
  target_id?: Types.ObjectId;

  @Prop({})
  quantity?: number;
}

export const ConditionSchema = SchemaFactory.createForClass(Condition);
